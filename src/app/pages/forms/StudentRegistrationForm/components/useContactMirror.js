// src/app/hooks/useContactMirror.js
import { useEffect, useMemo, useRef, useCallback } from "react";
import { useWatch, useFormContext } from "react-hook-form";

export function useContactMirror({ groups, fields }) {
  const { control, setValue } = useFormContext();

  const fieldFor = (p, n) => `${p}_${n}`;

  // Father values (source)
  const fatherValues = useWatch({
    control,
    name: fields.map((f) => fieldFor("father", f)),
  }) || [];

  // Only groups that can mirror father
  const enabledGroups = useMemo(
    () => groups.filter((g) => g.enableSameAsPrimary),
    [groups]
  );

  // Watch the "Same as Father" flags (order matches enabledGroups)
  const sameKeys = useMemo(
    () => enabledGroups.map((g) => fieldFor(g.prefix, "same_as_father")),
    [enabledGroups]
  );
  const sameFlags = useWatch({ control, name: sameKeys }) || [];

  // Lookup map for rendering
  const isSameByPrefix = useMemo(() => {
    const map = {};
    enabledGroups.forEach((g, i) => {
      map[g.prefix] = !!sameFlags[i];
    });
    return map;
  }, [enabledGroups, sameFlags]);

  // --- Copy helpers via ref to avoid effect deps churn ---
  const copyToPrefixRef = useRef(null);

  // Update the ref whenever inputs that affect copy change
  useEffect(() => {
    copyToPrefixRef.current = (prefix) => {
      fields.forEach((f, i) => {
        setValue(fieldFor(prefix, f), fatherValues[i] ?? "", { shouldValidate: false });
      });
    };
  }, [fields, fatherValues, setValue]);

  const copyToAllChecked = useCallback(() => {
    enabledGroups.forEach((g, i) => {
      if (sameFlags[i]) copyToPrefixRef.current?.(g.prefix);
    });
  }, [enabledGroups, sameFlags]);

  // Copy ON toggle (off -> on) — does NOT depend on fatherValues
  const prevFlagsRef = useRef(sameFlags);
  useEffect(() => {
    const prev = prevFlagsRef.current || [];
    enabledGroups.forEach((g, i) => {
      if (!prev[i] && sameFlags[i]) {
        copyToPrefixRef.current?.(g.prefix);
      }
    });
    prevFlagsRef.current = sameFlags;
  }, [enabledGroups, sameFlags]);

  // Call this after any Father field blur
  const onFatherBlur = useCallback(() => {
    copyToAllChecked();
  }, [copyToAllChecked]);

  return { isSameByPrefix, onFatherBlur };
}
