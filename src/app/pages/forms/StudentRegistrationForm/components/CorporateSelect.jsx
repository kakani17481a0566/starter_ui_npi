// src/app/pages/forms/StudentRegistrationForm/components/CorporateSelect.jsx

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Listbox } from "components/shared/form/Listbox";
import axios from "axios";
import { getSessionData } from "utils/sessionStorage";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://neuropi-fhafe3gchabde0gb.canadacentral-01.azurewebsites.net";

export const CorporateSelect = ({
  onCorporateSelect,
  value,
  className,
  disabled = false,
  tenantId: propTenantId,
}) => {
  const [selected, setSelected] = useState(value || null);
  const [corporates, setCorporates] = useState([
    { id: 0, name: "No Corporate", discount: 0, contactId: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch corporates
  useEffect(() => {
    const fetchCorporates = async () => {
      setLoading(true);
      setError(null);

      try {
        const { token, tenantId } = getSessionData();
        const finalTenantId = propTenantId ?? tenantId;

        const res = await axios.get(
          `${API_BASE}/api/Corporate/${finalTenantId}`,
          token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : undefined
        );

        if (res.data?.statusCode === 200 && res.data?.data) {
          const corporateOptions = [
            { id: 0, name: "No Corporate", discount: 0, contactId: 0 },
            ...res.data.data.map((corp) => ({
              id: corp.id,
              name: corp.name,
              discount: corp.discount,
              contactId: corp.contactId,
            })),
          ];
          setCorporates(corporateOptions);

          // Auto-select if value was passed and matches one of the options
          if (value) {
            const match = corporateOptions.find((c) => c.id === value.id);
            if (match) setSelected(match);
          }
        } else {
          throw new Error(res.data?.message || "Failed to fetch corporates");
        }
      } catch (err) {
        console.error("Error fetching corporates:", err);
        setError(err.message);
        // fallback: "No Corporate" only
        setCorporates([{ id: 0, name: "No Corporate", discount: 0, contactId: 0 }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCorporates();
  }, [propTenantId]);

  // Sync with external value changes
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (corporate) => {
    setSelected(corporate);
    onCorporateSelect?.(corporate);
  };

  return (
    <div className={className}>
      <div className="max-w-xl">
        <Listbox
          data={corporates}
          value={selected}
          placeholder={
            loading
              ? "Loading corporates..."
              : error
              ? "Error loading corporates"
              : "Select Corporate"
          }
          onChange={handleChange}
          displayField="name"
          disabled={disabled || loading}
        />
      </div>
    </div>
  );
};

CorporateSelect.propTypes = {
  onCorporateSelect: PropTypes.func,
  value: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    discount: PropTypes.number,
    contactId: PropTypes.number,
  }),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  tenantId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
