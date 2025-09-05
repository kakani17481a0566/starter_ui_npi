import { useFormContext } from "react-hook-form";
import { Card, Input } from "components/ui";
import {
  HomeIcon,
  UserGroupIcon,
  MapPinIcon,
  GlobeAltIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";

export default function AddressSection() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      {/* Home Address (Civic + Mailing) */}
      <Card className="p-4 sm:px-5">
        <div className="flex items-center gap-2">
          <HomeIcon className="text-primary-600 dark:text-primary-400 size-5" />
          <h3 className="text-base font-medium">
            Demographics — Home Address (Civic + Mailing)
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Input
              label={<LabelWithIcon icon={UserGroupIcon}>Parent/Guardian – Name(s)</LabelWithIcon>}
              {...register("pg_names")}
              error={errors?.pg_names?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <Input
              label={<LabelWithIcon icon={HomeIcon}>Apt</LabelWithIcon>}
              {...register("home_apt")}
              error={errors?.home_apt?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-9">
            <Input
              label={<LabelWithIcon icon={MapPinIcon}>Street/Road</LabelWithIcon>}
              {...register("home_street")}
              error={errors?.home_street?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label={<LabelWithIcon icon={GlobeAltIcon}>City (mailing)</LabelWithIcon>}
              {...register("mailing_city")}
              error={errors?.mailing_city?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-2">
            <Input
              label={<LabelWithIcon icon={HashtagIcon}>Postal Code (mailing)</LabelWithIcon>}
              {...register("mailing_postal")}
              error={errors?.mailing_postal?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label={<LabelWithIcon icon={GlobeAltIcon}>City (civic)</LabelWithIcon>}
              {...register("civic_city")}
              error={errors?.civic_city?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-2">
            <Input
              label={<LabelWithIcon icon={HashtagIcon}>Postal Code (civic)</LabelWithIcon>}
              {...register("civic_postal")}
              error={errors?.civic_postal?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label={<LabelWithIcon icon={HomeIcon}>House</LabelWithIcon>}
              {...register("civic_house")}
              error={errors?.civic_house?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input
              label={<LabelWithIcon icon={HomeIcon}>PO Box</LabelWithIcon>}
              {...register("civic_po_box")}
              error={errors?.civic_po_box?.message}
            />
          </div>
        </div>
      </Card>

      {/* Alternate Home Address (Shared Custody) */}
      <Card className="p-4 sm:px-5">
        <div className="dark:text-dark-100 mb-2 text-sm text-gray-700">
          Demographics — Alternate Home Address (Shared Custody) — Civic + Mailing
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12">
            <Input
              label={<LabelWithIcon icon={UserGroupIcon}>Parent/Guardian – Name(s)</LabelWithIcon>}
              {...register("alt_pg_names")}
              error={errors?.alt_pg_names?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <Input
              label={<LabelWithIcon icon={HomeIcon}>Apt</LabelWithIcon>}
              {...register("alt_home_apt")}
              error={errors?.alt_home_apt?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-9">
            <Input
              label={<LabelWithIcon icon={MapPinIcon}>Street/Road</LabelWithIcon>}
              {...register("alt_home_street")}
              error={errors?.alt_home_street?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label={<LabelWithIcon icon={GlobeAltIcon}>City (mailing)</LabelWithIcon>}
              {...register("alt_mailing_city")}
              error={errors?.alt_mailing_city?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-2">
            <Input
              label={<LabelWithIcon icon={HashtagIcon}>Postal Code (mailing)</LabelWithIcon>}
              {...register("alt_mailing_postal")}
              error={errors?.alt_mailing_postal?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label={<LabelWithIcon icon={GlobeAltIcon}>City (civic)</LabelWithIcon>}
              {...register("alt_civic_city")}
              error={errors?.alt_civic_city?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-2">
            <Input
              label={<LabelWithIcon icon={HashtagIcon}>Postal Code (civic)</LabelWithIcon>}
              {...register("alt_civic_postal")}
              error={errors?.alt_civic_postal?.message}
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <Input
              label={<LabelWithIcon icon={HomeIcon}>House</LabelWithIcon>}
              {...register("alt_civic_house")}
              error={errors?.alt_civic_house?.message}
            />
          </div>
          <div className="col-span-12 md:col-span-4">
            <Input
              label={<LabelWithIcon icon={HomeIcon}>PO Box</LabelWithIcon>}
              {...register("alt_civic_po_box")}
              error={errors?.alt_civic_po_box?.message}
            />
          </div>
        </div>
      </Card>
    </>
  );
}
