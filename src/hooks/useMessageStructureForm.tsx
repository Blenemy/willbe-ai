import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const LANGUAGES = [
  "English",
  "Spanish",
  "German",
  "French",
  "Ukrainian",
];

const schema = z.object({
  title: z.string().min(1),
  emailType: z.string().min(1),
  maxWords: z.string().min(1),
  subjectType: z.string().optional(),
  selectedLanguage: z.string().optional(),
  objective: z.string().optional(),
  subject: z.string().optional(),
  greeting: z.string().optional(),
  introduction: z.object({
    text: z.string().optional(),
    maxWords: z.string().optional(),
  }),
  body: z.array(
    z.object({ text: z.string().optional(), maxWords: z.string().optional() })
  ),
  goodbye: z.object({
    text: z.string().optional(),
    maxWords: z.string().optional(),
  }),
  sample: z.string().optional(),
});

export type MessageStructureFormSchema = z.infer<typeof schema>;

export const useMessageStructureForm = (editingId?: string) => {
  const router = useRouter();
  const form = useForm<MessageStructureFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      emailType: "",
      maxWords: "",
      subjectType: "",
      selectedLanguage: "",
      objective: "",
      subject: "",
      greeting: "",
      introduction: { text: "", maxWords: "" },
      body: [{ text: "", maxWords: "" }],
      goodbye: { text: "", maxWords: "" },
      sample: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "body",
  });
  const [currentLang, setCurrentLang] = useState(LANGUAGES[0]);
  const formsByLang = useRef<Record<string, MessageStructureFormSchema>>({});

  const { data: fetchedStructure } = useQuery({
    queryKey: ["message-structure", editingId],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        `/auth/message-structures/${editingId}`
      );
      return res.data;
    },
    enabled: !!editingId,
  });

  useEffect(() => {
    if (fetchedStructure) {
      form.setValue("title", fetchedStructure.name);
      form.setValue("emailType", fetchedStructure.messageType);
      form.setValue("maxWords", String(fetchedStructure.wordsLimit));
      form.setValue("subjectType", fetchedStructure.subjectType || "");
    }
  }, [fetchedStructure, form]);

  const createMutation = useMutation({
    mutationFn: async () => {
      const values = form.getValues();
      const res = await protectedAxiosInstance.post(
        "/auth/message-structures",
        {
          name: values.title,
          messageType: values.emailType,
          wordsLimit: Number(values.maxWords),
          subjectType: values.subjectType,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Structure created");
      router.push(`/dashboard/messages/message-structures/${data.id}`);
    },
    onError: () => {
      toast.error("Failed to create structure");
    },
  });

  const handleLanguageChange = (lang: string) => {
    const current = form.getValues();
    formsByLang.current[currentLang] = current;
    setCurrentLang(lang);
    form.reset({ ...form.getValues(), ...(formsByLang.current[lang] || {}) });
  };

  const eraseStructure = () => {
    form.reset({
      ...form.getValues(),
      objective: "",
      subject: "",
      greeting: "",
      introduction: { text: "", maxWords: "" },
      body: [{ text: "", maxWords: "" }],
      goodbye: { text: "", maxWords: "" },
      sample: "",
    });
  };

  return {
    form,
    fields,
    append,
    remove,
    createStructure: createMutation.mutate,
    eraseStructure,
    handleLanguageChange,
    currentLang,
    isCreating: createMutation.isPending,
  };
};
