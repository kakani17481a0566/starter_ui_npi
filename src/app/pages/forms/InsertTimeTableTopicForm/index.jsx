import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input, Button, Card, Select } from "components/ui";
import { getSessionData } from "utils/sessionStorage";
import { schema } from "./schema";
import { createTimeTableTopic, fetchTimeTableTopicsDropdown } from "./data";
import { BookOpenIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const InsertTimeTableTopicForm = ({ onSuccess, onCancel }) => {
  const session = getSessionData();

  const [dropdown, setDropdown] = useState({ courses: [] });
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema("create")),
    defaultValues: {
      courseId: "",
      subjectId: "",
      topicId: "",
      timeTableDetailId: "",
      tenantId: session.tenantId,
      createdBy: session.userId,
    },
    mode: "onChange",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetchTimeTableTopicsDropdown(session.tenantId);
        setDropdown(res.data || { courses: [] });
      } catch {
        toast.error("❌ Failed to load dropdown options");
      } finally {
        setLoading(false);
      }
    })();
  }, [session.tenantId]);

  const courseObj = dropdown.courses.find(
    (c) => String(c.id) === String(selectedCourseId),
  );
  const subjectObj = courseObj?.subjects.find(
    (s) => String(s.id) === String(selectedSubjectId),
  );

  useEffect(() => {
    setValue("subjectId", "");
    setSelectedSubjectId("");
    setValue("topicId", "");
    setValue("timeTableDetailId", "");
  }, [selectedCourseId, setValue]);

  useEffect(() => {
    setValue("topicId", "");
    setValue("timeTableDetailId", "");
  }, [selectedSubjectId, setValue]);

  useEffect(() => {
    setValue("timeTableDetailId", "");
  }, [selectedDate, setValue]);

  const filteredTimeTableDetails =
    subjectObj?.timeTableDetails?.filter((ttd) => {
      if (!selectedDate || !ttd.date) return false;
      return ttd.date.slice(0, 10) === selectedDate;
    }) || [];

  const onSubmit = async (data) => {
    try {
      const payload = {
        topicId: Number(data.topicId),
        timeTableDetailId: Number(data.timeTableDetailId),
        tenantId: Number(data.tenantId),
        createdBy: Number(data.createdBy),
      };

      const res = await createTimeTableTopic(payload);

      if (res?.statusCode === 201) {
        toast.success("✅ " + (res.message || "Time Table Topic Created"));
        reset({
          courseId: "",
          subjectId: "",
          topicId: "",
          timeTableDetailId: "",
          tenantId: session.tenantId,
          createdBy: session.userId,
        });
        setSelectedCourseId("");
        setSelectedSubjectId("");
        setSelectedDate("");
        if (onSuccess) onSuccess();
      } else {
        toast.error("❌ Unexpected error");
      }
    } catch (error) {
      const errData = error.response?.data;
      const message =
        Object.values(errData?.errors || {})[0]?.[0] ||
        errData?.title ||
        "Failed to create Time Table Topic";
      toast.error("❌ " + message);
    }
  };

  const requiredMark = <span className="pl-1 text-red-500">*</span>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="text-primary-950 dark:bg-dark-700 space-y-6 p-6 shadow-lg">
        <div className="text-primary-900 mb-2 text-lg font-semibold tracking-wide dark:text-white">
          <BookOpenIcon className="mr-2 inline-block h-5 w-5" />
          Create Time Table Topic
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                }}
                error={errors?.courseId?.message}
                labelSlot={requiredMark}
                disabled={loading}
              >
                <option value="" disabled>
                  {loading ? "Loading..." : "Select Course"}
                </option>
                {dropdown.courses.map((course) => (
                  <option key={course.id} value={String(course.id)}>
                    {course.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            name="subjectId"
            control={control}
            render={({ field }) => (
              <Select
                label="Subject"
                value={field.value}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedSubjectId(value);
                  field.onChange(value);
                }}
                error={errors?.subjectId?.message}
                labelSlot={requiredMark}
                disabled={!selectedCourseId || loading}
              >
                <option value="" disabled>
                  {selectedCourseId
                    ? "Select Subject"
                    : "Select a course first"}
                </option>
                {courseObj?.subjects.map((subject) => (
                  <option key={subject.id} value={String(subject.id)}>
                    {subject.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Input
            type="date"
            label="Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            labelSlot={requiredMark}
            disabled={!selectedSubjectId}
          />

          <Controller
            name="topicId"
            control={control}
            render={({ field }) => (
              <Select
                label="Topic"
                value={field.value}
                onChange={field.onChange}
                error={errors?.topicId?.message}
                labelSlot={requiredMark}
                disabled={!selectedSubjectId || loading}
              >
                <option value="" disabled>
                  {selectedSubjectId
                    ? "Select Topic"
                    : "Select a subject first"}
                </option>
                {subjectObj?.topics.map((topic) => (
                  <option key={topic.id} value={String(topic.id)}>
                    {topic.name}
                  </option>
                ))}
              </Select>
            )}
          />

          <Controller
            name="timeTableDetailId"
            control={control}
            render={({ field }) => (
              <Select
                label="Time Table Detail"
                value={field.value}
                onChange={field.onChange}
                error={errors?.timeTableDetailId?.message}
                labelSlot={requiredMark}
                disabled={!selectedSubjectId || !selectedDate || loading}
              >
                <option value="" disabled>
                  {!selectedSubjectId
                    ? "Select a subject first"
                    : !selectedDate
                      ? "Select a date"
                      : filteredTimeTableDetails.length === 0
                        ? "No periods for selected date"
                        : "Select Time Table Detail"}
                </option>
                {filteredTimeTableDetails.map((ttd) => (
                  <option key={ttd.id} value={String(ttd.id)}>
                    {ttd.name}
                    {ttd.date
                      ? ` (${new Date(ttd.date).toLocaleDateString()})`
                      : ""}
                  </option>
                ))}
              </Select>
            )}
          />

          <Input
            label="Tenant ID"
            value={session.tenantId}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
            labelSlot={requiredMark}
          />

          <Input
            label="Created By"
            value={session.userId}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
            labelSlot={requiredMark}
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            className="min-w-[8rem]"
          >
            Cancel
          </Button>
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

export default InsertTimeTableTopicForm;
