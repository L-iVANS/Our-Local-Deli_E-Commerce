import { useState, useCallback } from "react";
import { validateDeliveryDetails } from "../services";
import { DeliveryDetails, Company } from "../types";

export type CartAuthCompany = Company & {
  phoneNumber?: string;
};

export const useDeliveryForm = (company: Company, currentCompany: CartAuthCompany | null) => {
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    address: company.address || "",
    contactPerson: company.contactPerson || "",
    contactNumber: currentCompany?.phoneNumber || "",
    deliveryDate: "",
    notes: "",
    usePrimaryAddress: true,
  });

  const [errors, setErrors] = useState<Partial<DeliveryDetails>>({});

  const validateForm = useCallback(() => {
    const { isValid, errors: newErrors } = validateDeliveryDetails(delivery);
    setErrors(newErrors);
    return isValid;
  }, [delivery]);

  return { delivery, setDelivery, errors, setErrors, validateForm };
};
