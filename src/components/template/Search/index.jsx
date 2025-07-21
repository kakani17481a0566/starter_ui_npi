// Import Dependencies
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  MicrophoneIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { SpeechConfig, AudioConfig, SpeechRecognizer } from "microsoft-cognitiveservices-speech-sdk";
import invariant from "tiny-invariant";
import { Link, useNavigate } from "react-router";
import { useHotkeys } from "react-hotkeys-hook";
import clsx from "clsx";

// Local Imports
import { Button, Input } from "components/ui";
import { useDisclosure, useFuse } from "hooks";
import { useThemeContext } from "app/contexts/theme/context";
import { createScopedKeydownHandler } from "utils/dom/createScopedKeydownHandler";
import { navigation } from "app/navigation";
import { settings } from "app/navigation/settings";
import { NAV_TYPE_COLLAPSE } from "constants/app.constant";
import { Highlight } from "components/shared/Highlight";

// ----------------------------------------------------------------------

const data = flattenNav([...navigation, settings]);

const subscriptionKey = "7ZHQnjdH8f35SZypT2rYaoM1r7tfXWL2OoIafMUeqLzVFqDLTGE8JQQJ99BGACYeBjFXJ3w3AAAYACOGVCzT";
const region = "eastus";

export function Search({ renderButton }) {
  const [isOpen, { open, close }] = useDisclosure(false);

  useHotkeys("/", () => open(), {
    ignoreModifiers: true,
    preventDefault: true,
  });

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden sm:px-5 sm:py-6"
          onClose={close}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity dark:bg-black/30" />
          </TransitionChild>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="relative flex h-full w-full max-w-lg origin-bottom flex-col bg-white transition-all duration-300 dark:bg-dark-700 sm:max-h-[600px] sm:rounded-lg">
              <SearchDialog close={close} />
            </DialogPanel>
          </TransitionChild>
        </Dialog>
      </Transition>

      {renderButton ? renderButton(open) : null}
    </>
  );
}

export function SearchDialog({ close }) {
  const { isDark } = useThemeContext();
  const searchRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const navigate = useNavigate();

  const { result, query, setQuery } = useFuse(data, {
    keys: ["title"],
    threshold: 0.2,
    matchAllOnEmptyQuery: false,
  });

  useEffect(() => {
    invariant(searchRef.current, "searchRef is not assigned");
    searchRef.current.focus();
  }, []);

  const startAzureListening = async () => {
    try {
      setQuery("");
      setIsListening(true);

      const speechConfig = SpeechConfig.fromSubscription(subscriptionKey, region);
      speechConfig.speechRecognitionLanguage = "en-US";
      const audioConfig = AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync((result) => {
        const spokenText = result.text?.toLowerCase().replace(".", "").trim() || "";
        console.log("🗣️ Recognized:", spokenText);
        setIsListening(false);

        if (spokenText.startsWith("open")) {
          const keyword = spokenText.replace("open", "").trim();
          const matched = data.find((item) =>
            item.title.toLowerCase().includes(keyword)
          );

          if (matched) {
            navigate(matched.path);
            close();
            return;
          }
        }

        setQuery(spokenText);
      });
    } catch (err) {
      console.error("Azure Speech error:", err);
      setIsListening(false);
    }
  };

  return (
    <div data-search-wrapper className="flex flex-col overflow-hidden">
      <div className="rounded-t-lg bg-gray-200 py-2 dark:bg-dark-800 lg:py-3">
        <div className="flex items-center justify-between gap-2 pl-2 pr-4 rtl:pl-4 rtl:pr-2">
          <div className="flex flex-1 items-center gap-2">
            <Input
              ref={searchRef}
              placeholder="Search here..."
              value={query}
              data-search-item
              onChange={(e) => setQuery(e.target.value)}
              classNames={{ root: "flex-1", input: "border-none" }}
              prefix={<MagnifyingGlassIcon className="size-5" />}
              onKeyDown={createScopedKeydownHandler({
                siblingSelector: "[data-search-item]",
                parentSelector: "[data-search-wrapper]",
                activateOnFocus: false,
                loop: true,
                orientation: "vertical",
              })}
            />
            <Button
              onClick={startAzureListening}
              isIcon
              size="sm"
              variant="flat"
              className="h-8 w-8"
              title="Voice Search"
            >
              <MicrophoneIcon
                className={clsx(
                  "size-5",
                  isListening
                    ? "text-primary-600 animate-pulse"
                    : "text-gray-700 dark:text-dark-100"
                )}
              />
            </Button>
          </div>

          <Button
            onClick={close}
            variant={isDark ? "filled" : "outlined"}
            className="px-3 py-1.5 text-xs"
          >
            ESC
          </Button>
        </div>
      </div>

      {result.length === 0 && query !== "" && (
        <div className="flex flex-col overflow-y-auto py-4">
          <h3 className="px-4 text-gray-800 dark:text-dark-50 sm:px-5">
            No Result Found
          </h3>
        </div>
      )}

      {result.length > 0 && (
        <div className="flex flex-col overflow-y-auto py-4">
          <h3 className="px-4 text-gray-800 dark:text-dark-50 sm:px-5">
            Search Result
          </h3>
          <div className="space-y-3 px-4 pt-3">
            {result.map(({ item, refIndex }) => (
              <Link
                key={refIndex}
                onKeyDown={createScopedKeydownHandler({
                  siblingSelector: "[data-search-item]",
                  parentSelector: "[data-search-wrapper]",
                  activateOnFocus: false,
                  loop: true,
                  orientation: "vertical",
                })}
                data-search-item
                to={item.path}
                className="group flex items-center justify-between space-x-2 rounded-lg bg-gray-100 px-2.5 py-2 tracking-wide text-gray-800 outline-hidden transition-all focus:ring-3 focus:ring-primary-500/50 dark:bg-dark-600 dark:text-dark-100"
                onClick={close}
              >
                <div className="min-w-0">
                  <span className="truncate">
                    <Highlight query={query}>{item.title}</Highlight>
                  </span>
                </div>
                <ChevronRightIcon className="size-4.5 rtl:rotate-180" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------

function flattenNav(items) {
  let flatArray = [];
  items.forEach((item) => {
    if (item.path && item.type !== NAV_TYPE_COLLAPSE) {
      flatArray.push({ ...item });
    }
    if (item.childs) {
      flatArray = flatArray.concat(flattenNav(item.childs));
    }
  });
  return flatArray;
}

Search.propTypes = {
  renderButton: PropTypes.func,
};

SearchDialog.propTypes = {
  close: PropTypes.func,
};
