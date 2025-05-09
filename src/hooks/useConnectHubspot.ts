import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useConnectHubspot = () => {
  return useMutation({
    mutationFn: async () => {
      const res = await protectedAxiosInstance.get<{ url: string }>(
        "/auth/hubspot/connect"
      );
      return res.data;
    },
    onSuccess: (data) => {
      if (data.url && typeof window !== "undefined") {
        window.open(data.url, "_blank");
      }
    },
    onError: () => {
      toast("Failed to connect hubspot");
    },
  });
};

export const useDisconnectHubspot = () => {
  const { user } = useAuth({ enableFetch: true });
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await protectedAxiosInstance.delete<{ url: string }>(
        `/auth/hubspot/disconnect/${user.companyId}`
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-connections"] });

      toast("Hubspot was succesfully disconnected");
    },
    onError: () => {
      toast("Failed to disconnect hubspot");
    },
  });
};

export type HubspotBindings = {
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;

  crmAccountCityField: string | null;
  crmAccountCompanyTitleField: string | null;
  crmAccountDescriptionField: string | null;
  crmAccountEmployeesField: string | null;
  crmAccountFoundedInField: string | null;
  crmAccountHeadquartersField: string | null;
  crmAccountIndustryField: string | null;
  crmAccountLinkedInField: string | null;
  crmAccountNameField: string | null;
  crmAccountWebsiteField: string | null;

  crmLeadCompanyField: string | null;
  crmLeadEmailField: string | null;
  crmLeadFirstNameField: string | null;
  crmLeadIndustryField: string | null;
  crmLeadJobTitleField: string | null;
  crmLeadLanguageField: string | null;
  crmLeadLastNameField: string | null;
  crmLeadLinkedInField: string | null;
  crmLeadLocationCityField: string | null;
  crmLeadLocationCountryField: string | null;
  crmLeadPhoneField: string | null;
  crmLeadPositionDescriptionField: string | null;
  crmLeadPositionField: string | null;
  crmLeadSubtitleField: string | null;
  crmLeadSummaryField: string | null;
};

export type HubspotField = {
  name: string;
  label: string;
  description: string;
  type: string;
  fieldType: string;
  groupName: string;
  hidden: boolean;
};

export type HubspotContactsFieldsResponse = Partial<{
  crmLeadFirstNameField: HubspotField[];
  crmLeadLastNameField: HubspotField[];
  crmLeadCompanyField: HubspotField[];
  crmLeadJobTitleField: HubspotField[];
  crmLeadIndustryField: HubspotField[];
  crmLeadEmailField: HubspotField[];
  crmLeadPhoneField: HubspotField[];
  crmLeadLinkedInField: HubspotField[];
  crmLeadLocationCityField: HubspotField[];
  crmLeadLocationCountryField: HubspotField[];
  crmLeadLanguageField: HubspotField[];
  crmLeadPositionField: HubspotField[];
  crmLeadPositionDescriptionField: HubspotField[];
  crmLeadSubtitleField: HubspotField[];
  crmLeadSummaryField: HubspotField[];

  crmLeadNotContactedField: HubspotField[];
  crmLeadInCadenceField: HubspotField[];
  crmLeadResponseField: HubspotField[];
  crmLeadMeetingField: HubspotField[];
  crmLeadBouncedField: HubspotField[];
  crmLeadOutOfOfficeField: HubspotField[];
  crmLeadUnresponsiveField: HubspotField[];
}>;

export type HubspotCompaniesFieldsResponse = Partial<{
  crmAccountNameField: HubspotField[];
  crmAccountCityField: HubspotField[];
  crmAccountWebsiteField: HubspotField[];
  crmAccountPhoneField: HubspotField[];
  crmAccountIndustryField: HubspotField[];
  crmAccountCountryField: HubspotField[];
  crmAccountOwnerField: HubspotField[];
  crmAccountCompanyTitleField: HubspotField[];
  crmAccountFoundedInField: HubspotField[];
  crmAccountHeadquartersField: HubspotField[];
  crmAccountEmployeesField: HubspotField[];
  crmAccountLinkedInField: HubspotField[];
  crmAccountDescriptionField: HubspotField[];
}>;

export const useHubspotSettingsData = () => {
  const { user } = useAuth({ enableFetch: true });
  const companyId = user?.companyId;

  const enabled = Boolean(companyId);

  const contactsFieldsQuery = useQuery<HubspotContactsFieldsResponse>({
    queryKey: ["hubspot", "contacts-fields", companyId],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        `/auth/hubspot/contacts-table-fields/${companyId}`
      );
      return res.data;
    },
    enabled,
  });

  const companiesFieldsQuery = useQuery<HubspotCompaniesFieldsResponse>({
    queryKey: ["hubspot", "companies-fields", companyId],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        `/auth/hubspot/companies-table-fields/${companyId}`
      );
      return res.data;
    },
    enabled,
  });

  const fieldBindingsQuery = useQuery({
    queryKey: ["hubspot", "field-bindings", companyId],
    queryFn: async () => {
      const res = await protectedAxiosInstance.get(
        `/auth/hubspot/fields-bindings/${companyId}`
      );
      return res.data;
    },
    enabled,
  });

  return {
    contactsFields: contactsFieldsQuery.data,
    companiesFields: companiesFieldsQuery.data,
    bindings: fieldBindingsQuery.data,
    isLoading:
      contactsFieldsQuery.isLoading ||
      companiesFieldsQuery.isLoading ||
      fieldBindingsQuery.isLoading,
    isError:
      contactsFieldsQuery.isError ||
      companiesFieldsQuery.isError ||
      fieldBindingsQuery.isError,
  };
};

export const useUpdateHubspotBindings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      companyId,
      data,
    }: {
      companyId: string;
      data: Record<string, string | null>;
    }) => {
      const response = await protectedAxiosInstance.patch(
        `/auth/hubspot/fields-bindings/${companyId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hubspot"] });
      queryClient.invalidateQueries({ queryKey: ["contacts-fields"] });
      queryClient.invalidateQueries({ queryKey: ["field-bindings"] });
      queryClient.invalidateQueries({ queryKey: ["companies-fields"] });

      toast("Successfully updated bindings");
    },
    onError: () => {
      toast("Failed to update bindings");
    },
  });
};

export const useStartHubspotIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      companyId,
      enrich,
    }: {
      companyId: string;
      enrich: boolean;
    }) => {
      const url = enrich
        ? `/auth/hubspot/start-with-enrich/${companyId}`
        : `/auth/hubspot/start-without-enrich/${companyId}`;

      const res = await protectedAxiosInstance.post(url);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account-page"] });
      queryClient.invalidateQueries({ queryKey: ["lead"] });

      toast("Account was succesfully updated");
    },
  });
};
