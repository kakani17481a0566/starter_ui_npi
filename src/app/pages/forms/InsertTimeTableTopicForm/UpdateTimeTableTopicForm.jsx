import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Input, Button, Card, Select } from "components/ui";
import { getSessionData } from "utils/sessionStorage";
import { useEffect, useState } from "react";
import { schema } from "./schema";
import {
  fetchTimeTableTopicsDropdown,
  updateTimeTableTopic,
} from "./data";
import { BookOpenIcon, Loader2Icon } from "lucide-react";

const UpdateTimeTableTopicForm = ({ initialData, onSuccess, onCancel }) => {
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
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(schema("update")),
    defaultValues: {
      courseId: "",
      subjectId: "",
      topicId: "",
      timeTableDetailId: "",
      tenantId: session.tenantId,
      updatedBy: session.userId,
    },
    mode: "onChange",
  });

  const inferCourseSubjectFromTopic = (topicId) => {
    for (const course of dropdown.courses) {
      for (const subject of course.subjects || []) {
        if (subject.topics?.some((t) => t.id === topicId)) {
          return {
            courseId: String(course.id),
            subjectId: String(subject.id),
          };
        }
      }
    }
    return { courseId: "", subjectId: "" };
  };

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        setLoading(true);
        const res = await fetchTimeTableTopicsDropdown(session.tenantId);
        setDropdown(res.data || { courses: [] });
      } catch {
        toast.error("❌ Failed to load data for update");
      } finally {
        setLoading(false);
      }
    };
    loadDropdowns();
  }, [session.tenantId]);

  useEffect(() => {
    if (dropdown.courses.length > 0 && initialData) {
      console.log("🟡 Initial Data received:", initialData);

      let { courseId, subjectId } = initialData;

      if (!courseId || !subjectId) {
        const inferred = inferCourseSubjectFromTopic(initialData.topicId);
        courseId = inferred.courseId;
        subjectId = inferred.subjectId;
      }

      setValue("courseId", courseId);
      setValue("subjectId", subjectId);
      setValue("topicId", String(initialData.topicId));
      setValue("timeTableDetailId", String(initialData.timeTableDetailId));

      setSelectedCourseId(courseId);
      setSelectedSubjectId(subjectId);
      setSelectedDate(initialData.timeTableDate?.slice(0, 10) || "");
    }
  }, [dropdown, initialData, setValue]);

  const courseObj = dropdown.courses.find(
    (c) => String(c.id) === String(selectedCourseId)
  );
  const subjectObj = courseObj?.subjects.find(
    (s) => String(s.id) === String(selectedSubjectId)
  );

  const filteredTimeTableDetails =
    subjectObj?.timeTableDetails?.filter((ttd) => {
      return selectedDate && ttd.date?.slice(0, 10) === selectedDate;
    }) || [];

  const onSubmit = async (data) => {
    try {
      const payload = {
        id: initialData.id,
        topicId: Number(data.topicId),
        timeTableDetailId: Number(data.timeTableDetailId),
        tenantId: Number(data.tenantId),
        updatedBy: Number(session.userId),
      };

      const res = await updateTimeTableTopic(payload);

      if (res?.statusCode === 200) {
        toast.success("✅ Time Table Topic Updated");
        onSuccess?.();
      } else {
        toast.error("❌ Unexpected error during update");
      }
    } catch (error) {
      const errData = error.response?.data;
      const message =
        Object.values(errData?.errors || {})[0]?.[0] ||
        errData?.title ||
        "Failed to update Time Table Topic";
      toast.error("❌ " + message);
    }
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <Card className="text-primary-950 dark:bg-dark-700 space-y-6 p-6 shadow-lg">
        <div className="text-primary-900 mb-2 text-lg font-semibold tracking-wide dark:text-white">
          <BookOpenIcon className="mr-2 inline-block h-5 w-5" />
          Update Time Table Topic
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
                disabled={!selectedCourseId || loading}
              >
                <option value="" disabled>
                  {selectedCourseId ? "Select Subject" : "Select a course first"}
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
            label="Date *"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
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
                disabled={!selectedSubjectId || loading}
              >
                <option value="" disabled>
                  {selectedSubjectId ? "Select Topic" : "Select a subject first"}
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
                    {ttd.name} ({new Date(ttd.date).toLocaleDateString()})
                  </option>
                ))}
              </Select>
            )}
          />

          <Input
            label="Tenant ID *"
            value={session.tenantId}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
          />

          <Input
            label="Updated By *"
            value={session.userId}
            readOnly
            className="dark:bg-dark-500 bg-gray-100"
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={onCancel} type="button" className="min-w-[8rem]">
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
              "Update"
            )}
          </Button>
        </div>
      </Card>
    </form>
  );
};

export default UpdateTimeTableTopicForm;
