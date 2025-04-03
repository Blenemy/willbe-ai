/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { protectedAxiosInstance } from "@/api/axiosInstance";
import { toast } from "sonner";
import { useRef } from "react";
import { LANGUAGES } from "@/constants/languagesMessageStructure";

interface CreateTemplateInput {
  language: string;
  structureId: string;
  from?: string;
}

interface UpdateTemplateInput {
  language: string;
  data: any;
}

export const useMessageTemplates = () => {
  const queryClient = useQueryClient();
  const templateMap = useRef<Record<string, string>>({});

  const createTemplateMutation = useMutation({
    mutationFn: async ({
      language,
      structureId,
      from,
    }: CreateTemplateInput) => {
      const payload: any = { messageStructureId: structureId, language };

      if (from) {
        payload.translateFromLanguage = LANGUAGES.find(
          (lang) => lang.label === from
        )?.code;
      }

      const res = await protectedAxiosInstance.post(
        "/auth/message-templates",
        payload
      );
      return res.data;
    },
    onSuccess: (data, variables) => {
      templateMap.current[variables.language] = data.id;
      toast.success(`Template for ${variables.language} created`);
      queryClient.invalidateQueries({
        queryKey: ["message-structure", variables.structureId],
      });
    },
    onError: () => toast.error("Failed to create template"),
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ language, data }: UpdateTemplateInput) => {
      const id = templateMap.current[language];
      if (!id) throw new Error("Template ID not found for language");
      const res = await protectedAxiosInstance.patch(
        `/auth/message-templates/${id}`,
        data
      );
      return res.data;
    },
    onSuccess: () => toast.success("Template updated"),
    onError: () => toast.error("Failed to update template"),
  });

  const getTemplateId = (lang: string) => templateMap.current[lang];
  const hasTemplate = (lang: string) => !!templateMap.current[lang];

  const fetchTemplateId = async (structureId: string, language: string) => {
    try {
      const res = await protectedAxiosInstance.get("/auth/message-templates", {
        params: {
          structureId,
          language,
        },
      });

      if (res.data?.id) {
        templateMap.current[language] = res.data.id;
      }

      return res.data;
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const deleteTemplateMutation = useMutation({
    mutationFn: async (language: string) => {
      const id = templateMap.current[language];
      if (!id) throw new Error("Template ID not found for language");

      await protectedAxiosInstance.delete(`/auth/message-templates/${id}`);
      return id;
    },
    onSuccess: (deletedId, language) => {
      toast.success("Template deleted");
      delete templateMap.current[language];
      queryClient.invalidateQueries({ queryKey: ["message-structure"] });
    },
    onError: () => {
      toast.error("Failed to delete template");
    },
  });

  return {
    createTemplate: createTemplateMutation.mutateAsync,
    updateTemplate: updateTemplateMutation.mutateAsync,
    deleteTemplate: deleteTemplateMutation.mutateAsync,
    hasTemplate,
    getTemplateId,
    fetchTemplateId,
  };
};
