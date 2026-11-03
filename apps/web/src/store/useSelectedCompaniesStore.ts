import { create } from "zustand";
import { AccountSearch } from "@/types/AccountSearch";

export type CompanyType = AccountSearch;

type SelectedCompaniesStore = {
  selectedCompanies: Record<string, CompanyType>;
  toggleCompany: (company: CompanyType) => void;
  addCompanies: (companies: CompanyType[]) => void;
  removeCompanies: (companies: CompanyType[]) => void;
  clear: () => void;
};

export const useSelectedCompaniesStore = create<SelectedCompaniesStore>(
  (set) => ({
    selectedCompanies: {},

    toggleCompany: (company) =>
      set((state) => {
        const updated = { ...state.selectedCompanies };
        if (updated[company.id]) {
          delete updated[company.id];
        } else {
          updated[company.id] = company;
        }
        return { selectedCompanies: updated };
      }),

    addCompanies: (companies) =>
      set((state) => {
        const updated = { ...state.selectedCompanies };
        companies.forEach((c) => {
          updated[c.id] = c;
        });
        return { selectedCompanies: updated };
      }),

    removeCompanies: (companies) =>
      set((state) => {
        const updated = { ...state.selectedCompanies };
        companies.forEach((c) => {
          delete updated[c.id];
        });
        return { selectedCompanies: updated };
      }),

    clear: () => set({ selectedCompanies: {} }),
  })
);
