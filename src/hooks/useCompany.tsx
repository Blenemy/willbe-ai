import { protectedAxiosInstance } from "@/api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { Company, ProductsAndServices } from "@/types/Company";
import { toast } from "sonner";

interface UseAuthProps {
  enableFetch: boolean;
}

interface UpdateCompantProps {
  name: string;
  description: string;
  sector: string;
}

interface CreateCompanyAndServicePayload {
  name: string;
  description: string;
}

interface UpdateCompanyAndServicePayload
  extends CreateCompanyAndServicePayload {
  id: number;
}

export const useCompany = ({ enableFetch = false }: UseAuthProps) => {
  const { user } = useAuth({ enableFetch: true });
  const queryClient = useQueryClient();

  const { data: company, isLoading } = useQuery<Company>({
    queryKey: ["company", user?.companyId],
    queryFn: async () => {
      const response = await protectedAxiosInstance.get(
        `/auth/companies/${user.companyId}`
      );
      return response.data;
    },
    retry: true,
    staleTime: 1000 * 60 * 5,
    enabled: enableFetch && !!user?.companyId,
  });

  const updateCompanyMutation = useMutation({
    mutationFn: async (data: UpdateCompantProps) => {
      const response = await protectedAxiosInstance.patch(
        `/auth/companies/${user.companyId}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", user?.companyId] });

      toast("Company was updated succesfully");
    },
    onError: (err) => {
      toast(`Failed to update a company: ${err.message}`);
    },
  });

  const { data: productsAndServices, isLoading: productsAndServicesLoading } =
    useQuery<ProductsAndServices[]>({
      queryKey: ["productsAndServices", user?.companyId],
      queryFn: async () => {
        const response = await protectedAxiosInstance.get(
          `/auth/companies/${user.companyId}/products-and-services`
        );
        return response.data;
      },
      retry: true,
      staleTime: 1000 * 60 * 5,
      enabled: enableFetch,
    });

  const createCompanyProductAndService = useMutation({
    mutationFn: async (data: CreateCompanyAndServicePayload) => {
      const response = await protectedAxiosInstance.post(
        `/auth/companies/${user.companyId}/products-and-services`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsAndServices"] });
    },
  });

  const deleteCompanyProductAndService = useMutation({
    mutationFn: async (data: { id: number }) => {
      const response = await protectedAxiosInstance.delete(
        `/auth/companies/products-and-services/${data.id}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsAndServices"] });
    },
  });

  const updateCompanyProductAndService = useMutation({
    mutationFn: async (data: UpdateCompanyAndServicePayload) => {
      const response = await protectedAxiosInstance.patch(
        `/auth/companies/products-and-services/${data.id}`,
        { name: data.name, description: data.description }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsAndServices"] });
    },
  });

  return {
    company,
    productsAndServices,
    isLoading,
    productsAndServicesLoading,
    updateCompany: updateCompanyMutation.mutate,
    createProductAndService: createCompanyProductAndService.mutate,
    deleteCompanyProductAndService: deleteCompanyProductAndService.mutate,
    updateCompanyProductAndService: updateCompanyProductAndService.mutate,
  };
};
