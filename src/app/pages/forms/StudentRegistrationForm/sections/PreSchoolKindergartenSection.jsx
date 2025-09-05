import { useFormContext } from "react-hook-form";
import { Card, Input, Radio, Collapse } from "components/ui";
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import LabelWithIcon from "../components/LabelWithIcon";

export default function PreSchoolKindergartenSection() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const attendingPreschool = watch("attending_preschool");
  const previousKG = watch("previously_registered_kg");

  return (
    <Card className="p-4 sm:px-5">
      <div className="grid grid-cols-12 gap-4">
        {/* Attending Pre-school */}
        <div className="col-span-12 md:col-span-6">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={AcademicCapIcon}>
              Attending Pre-school?
            </LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio
              label="Yes"
              value="yes"
              {...register("attending_preschool")}
            />
            <Radio label="No" value="no" {...register("attending_preschool")} />
          </div>
          <Collapse in={attendingPreschool === "yes"}>
            <div className="mt-3">
              <Input
                label={
                  <LabelWithIcon icon={BuildingOfficeIcon}>
                    If yes, name of pre-school
                  </LabelWithIcon>
                }
                {...register("preschool_name")}
                error={errors?.preschool_name?.message}
              />
            </div>
          </Collapse>
        </div>

        {/* Previously registered for kindergarten */}
        <div className="col-span-12 md:col-span-6">
          <label className="dark:text-dark-100 mb-1 block text-sm font-medium text-gray-700">
            <LabelWithIcon icon={AcademicCapIcon}>
              Previously registered for kindergarten?
            </LabelWithIcon>
          </label>
          <div className="flex gap-6">
            <Radio
              label="Yes"
              value="yes"
              {...register("previously_registered_kg")}
            />
            <Radio
              label="No"
              value="no"
              {...register("previously_registered_kg")}
            />
          </div>
          <Collapse in={previousKG === "yes"}>
            <div className="mt-3">
              <Input
                label={
                  <LabelWithIcon icon={BuildingOfficeIcon}>
                    If yes, name of school
                  </LabelWithIcon>
                }
                {...register("previous_kg_school_name")}
                error={errors?.previous_kg_school_name?.message}
              />
            </div>
          </Collapse>
        </div>
      </div>
    </Card>
  );
}
