"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Minus, Wand2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";

const EMAIL_TYPES = [
  "first_email",
  "follow_up_email",
  "linkedin_connection",
  "linkedin_message",
  "linkedin_follow_up",
];

const LANGUAGES = ["English", "Spanish", "German", "French", "Ukrainian"];

export default function MessageStructureEditor() {
  const params = useParams();
  const router = useRouter();
  const editingId = params?.id as string | undefined;
  const [structureId, setStructureId] = useState<string | null>(
    editingId || null
  );

  const [title, setTitle] = useState("");
  const [emailType, setEmailType] = useState("");
  const [maxWords, setMaxWords] = useState("");
  const [subjectType, setSubjectType] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [form, setForm] = useState({
    objective: "",
    subject: "",
    greeting: "",
    introduction: { text: "", maxWords: "" },
    body: [{ text: "", maxWords: "" }],
    goodbye: { text: "", maxWords: "" },
    sample: "",
  });

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

  const createStructureMutation = useMutation({
    mutationFn: async () => {
      const res = await protectedAxiosInstance.post(
        "/auth/message-structures",
        {
          name: "First Email Template",
          messageType: "first_email",
          wordsLimit: 500,
          subjectType: "account_company",
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      setStructureId(data.id);
      router.push(`/dashboard/messages/message-structures/${data.id}`);
    },
  });

  useEffect(() => {
    if (fetchedStructure) {
      setTitle(fetchedStructure.name);
      setEmailType(fetchedStructure.messageType);
      setMaxWords(fetchedStructure.wordsLimit.toString());
      setSubjectType(fetchedStructure.subjectType || "");
    }
  }, [fetchedStructure]);

  const canShowLanguageSelector = emailType && maxWords && structureId;
  const canShowStructureFields = selectedLanguage;
  const isFirstEmail = emailType === "first_email";

  const handleBodyChange = (index: number, field: string, value: string) => {
    const updated = [...form.body];
    // @ts-expect-error index[field] has any type
    updated[index][field] = value;
    setForm({ ...form, body: updated });
  };

  const addParagraph = () => {
    setForm({ ...form, body: [...form.body, { text: "", maxWords: "" }] });
  };

  const removeParagraph = (index: number) => {
    setForm({ ...form, body: form.body.filter((_, i) => i !== index) });
  };

  const insertFriendly = (field: string) => {
    if (field === "introduction" || field === "goodbye") {
      setForm({
        ...form,
        [field]: {
          ...form[field],
          text: `${form[field].text} 😊`,
        },
      });
    } else if (field === "body") {
      const updated = [...form.body];
      updated[0].text += " 😊";
      setForm({ ...form, body: updated });
    } else {
      // @ts-expect-error index[field] has any type
      setForm({ ...form, [field]: `${form[field]} 😊` });
    }
  };

  const handleErase = () => {
    setForm({
      objective: "",
      subject: "",
      greeting: "",
      introduction: { text: "", maxWords: "" },
      body: [{ text: "", maxWords: "" }],
      goodbye: { text: "", maxWords: "" },
      sample: "",
    });
  };

  const isFormComplete =
    title &&
    emailType &&
    maxWords &&
    selectedLanguage &&
    form.objective &&
    (!isFirstEmail || form.subject) &&
    form.greeting &&
    form.introduction.text &&
    form.introduction.maxWords &&
    form.body.every((p) => p.text && p.maxWords) &&
    form.goodbye.text &&
    form.goodbye.maxWords &&
    form.sample;

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Create Message Structure</h1>

      {!structureId && (
        <>
          <Input
            placeholder="Message structure title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Button
            disabled={!title}
            onClick={() => createStructureMutation.mutate()}
          >
            Create structure
          </Button>
        </>
      )}

      {structureId && (
        <>
          <Select value={emailType} onValueChange={setEmailType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select email type" />
            </SelectTrigger>
            <SelectContent>
              {EMAIL_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Maximum number of words"
            value={maxWords}
            onChange={(e) => setMaxWords(e.target.value)}
          />
          {isFirstEmail && (
            <Input
              placeholder="Subject type"
              value={subjectType}
              onChange={(e) => setSubjectType(e.target.value)}
            />
          )}
        </>
      )}

      {canShowLanguageSelector && (
        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {canShowStructureFields && (
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Objective"
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertFriendly("objective")}
            >
              <Wand2 className="w-4 h-4" /> Friendly
            </Button>
          </div>

          {isFirstEmail && (
            <Input
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          )}

          <div>
            <Input
              placeholder="Greeting"
              value={form.greeting}
              onChange={(e) => setForm({ ...form, greeting: e.target.value })}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertFriendly("greeting")}
            >
              <Wand2 className="w-4 h-4" /> Friendly
            </Button>
          </div>

          <div>
            <Textarea
              placeholder="Introduction"
              value={form.introduction.text}
              onChange={(e) =>
                setForm({
                  ...form,
                  introduction: { ...form.introduction, text: e.target.value },
                })
              }
            />
            <Input
              type="number"
              placeholder="Max words"
              value={form.introduction.maxWords}
              onChange={(e) =>
                setForm({
                  ...form,
                  introduction: {
                    ...form.introduction,
                    maxWords: e.target.value,
                  },
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">Body Paragraphs</label>
            {form.body.map((para, index) => (
              <div key={index} className="space-y-1">
                <Textarea
                  placeholder={`Paragraph ${index + 1}`}
                  value={para.text}
                  onChange={(e) =>
                    handleBodyChange(index, "text", e.target.value)
                  }
                />
                <Input
                  type="number"
                  placeholder="Max words"
                  value={para.maxWords}
                  onChange={(e) =>
                    handleBodyChange(index, "maxWords", e.target.value)
                  }
                />
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" onClick={addParagraph}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  {form.body.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeParagraph(index)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => insertFriendly("body")}
                  >
                    <Wand2 className="w-4 h-4" /> Friendly
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <Textarea
              placeholder="Goodbye"
              value={form.goodbye.text}
              onChange={(e) =>
                setForm({
                  ...form,
                  goodbye: { ...form.goodbye, text: e.target.value },
                })
              }
            />
            <Input
              type="number"
              placeholder="Max words"
              value={form.goodbye.maxWords}
              onChange={(e) =>
                setForm({
                  ...form,
                  goodbye: { ...form.goodbye, maxWords: e.target.value },
                })
              }
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => insertFriendly("goodbye")}
            >
              <Wand2 className="w-4 h-4" /> Friendly
            </Button>
          </div>

          <Textarea
            placeholder="Sample email"
            value={form.sample}
            onChange={(e) => setForm({ ...form, sample: e.target.value })}
          />

          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleErase}>
              Erase structure for {selectedLanguage}
            </Button>

            <Button
              disabled={!isFormComplete}
              onClick={() => alert("Structure saved!")}
            >
              Save email structure for {selectedLanguage}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
