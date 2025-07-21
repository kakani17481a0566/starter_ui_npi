import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input, Button, Card, Select } from "components/ui";
import { getSessionData } from "utils/sessionStorage";
import { schema } from "./schema";
import { createTopic, fetchTimeTableDropdown } from "./data";
import { BookOpenIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const InsertTopicsForm = ({ onSuccess }) => {
  const session = getSessionData();
  const [courses, setCourses] = useState({});
  const [topicTypes, setTopicTypes] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
      courseId: "",
      subjectId: "",
      topicTypeId: "",
      tenantId: session.tenantId,
      createdBy: session.userId,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const res = await fetchTimeTableDropdown(session.tenantId);
        setCourses(res.data?.courses || {});
        setTopicTypes(res.data?.topicTypes || []);
      } catch {
        toast.error("❌ Failed to load dropdown options");
      }
    };
    loadDropdowns();
  }, [session.tenantId]);

  const subjectOptions =
    selectedCourseId && courses[selectedCourseId]?.subjects
      ? Object.entries(courses[selectedCourseId].subjects)
      : [];

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        name: data.name?.trim(),
        code: data.code?.trim(),
        description: data.description?.trim(),
        courseId: Number(data.courseId),
        subjectId: Number(data.subjectId),
        topicTypeId: Number(data.topicTypeId),
        tenantId: Number(data.tenantId),
        createdBy: Number(data.createdBy),
      };

      const res = await createTopic(payload);

      if (res?.statusCode === 201) {
        toast.success("✅ " + (res.message || "Topic Created Successfully"));
        reset({
          name: "",
          code: "",
          description: "",
          courseId: "",
          subjectId: "",
          topicTypeId: "",
          tenantId: session.tenantId,
          createdBy: session.userId,
        });
        setSelectedCourseId("");
        if (onSuccess) onSuccess();
      } else {
        toast.error("❌ Unexpected error");
      }
    } catch (error) {
      const errData = error.response?.data;
      const message =
        Object.values(errData?.errors || {})[0]?.[0] ||
        errData?.title ||
        "Failed to create topic";
      toast.error("❌ " + message);
    }
  };

  const requiredMark = <span className="pl-1 text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="text-primary-950 dark:bg-dark-700 space-y-6 p-6 shadow-lg">
        <div className="text-primary-900 mb-2 text-lg font-semibold tracking-wide dark:text-white">
          <BookOpenIcon className="mr-2 inline-block h-5 w-5" />
          Create New Topic
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Name"
            {...register("name")}
            error={errors?.name?.message}
            labelSlot={requiredMark}
          />

          <Input
            label="Code"
            {...register("code")}
            error={errors?.code?.message}
          />

          <Input
            label="Description"
            {...register("description")}
            error={errors?.description?.message}
          />

          {/* Course Dropdown */}
          <Controller
            name="courseId"
            control={control}
            render={({ field }) => (
              <Select
                label="Course"
                value={field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCourseId(value);
                  field.onChange(value);
                  setValue("subjectId", "");
                }}
                error={errors?.courseId?.message}
                labelSlot={requiredMark}
              >
                <option value="" disabled>
                  Select Course
                </option>
                {Object.entries(courses).map(([id, course]) => (
                  <option key={id} value={id}>
                    {course.name}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* Subject Dropdown */}
          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <Select
                label="Subject"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                error={errors?.subjectId?.message}
                labelSlot={requiredMark}
                disabled={!selectedCourseId}
              >
                <option value="" disabled>
                  {selectedCourseId ? "Select Subject" : "Select a course first"}
                </option>
                {subjectOptions.map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
            )}
          />

          {/* ✅ Topic Type Dropdown */}
          <Controller
            name="topicTypeId"
            control={control}
            render={({ field }) => (
              <Select
                label="Topic Type"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                error={errors?.topicTypeId?.message}
                labelSlot={requiredMark}
              >
                <option value="" disabled>
                  Select Topic Type
                </option>
                {topicTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Input
            label="Tenant ID"
            {...register("tenantId")}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
            labelSlot={requiredMark}
          />

          <Input
            label="Created By"
            {...register("createdBy")}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
            labelSlot={requiredMark}
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className={`min-w-[8rem] font-medium text-white ${
              !isValid || isSubmitting
                ? "cursor-not-allowed bg-red-500 opacity-70"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2Icon className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default InsertTopicsForm;
