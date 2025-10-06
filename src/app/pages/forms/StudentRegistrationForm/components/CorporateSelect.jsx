// Import Dependencies
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Local Imports
import { Listbox } from "components/shared/form/Listbox";

// ----------------------------------------------------------------------

const CorporateSelect = ({
  onCorporateSelect,
  value,
  className,
  disabled = false,
  tenantId = 1 // Default tenantId, can be passed as prop
}) => {
  const [selected, setSelected] = useState(value || null);
  const [corporates, setCorporates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch corporates from API
  useEffect(() => {
    const fetchCorporates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://localhost:7202/api/Corporate/${tenantId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch corporates: ${response.status}`);
        }

        const result = await response.json();

        if (result.statusCode === 200 && result.data) {
          // Add "No Corporate" option and transform data
          const corporateOptions = [
            { id: 0, name: "No Corporate", discount: 0, contactId: 0 },
            ...result.data.map(corp => ({
              id: corp.id,
              name: corp.name,
              discount: corp.discount,
              contactId: corp.contactId
            }))
          ];
          setCorporates(corporateOptions);
        } else {
          throw new Error(result.message || 'Failed to fetch corporates');
        }
      } catch (err) {
        console.error('Error fetching corporates:', err);
        setError(err.message);
        // Fallback to empty array with just "No Corporate" option
        setCorporates([{ id: 0, name: "No Corporate", discount: 0, contactId: 0 }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCorporates();
  }, [tenantId]);

  // Sync with external value changes
  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleChange = (corporate) => {
    setSelected(corporate);
    onCorporateSelect?.(corporate);
  };

  if (loading) {
    return (
      <div className={className}>
        <div className="max-w-xl">
          <Listbox
            data={[]}
            value={null}
            placeholder="Loading corporates..."
            onChange={() => {}}
            displayField="name"
            disabled={true}
          />
        </div>
      </div>
    );
  }

  if (error && corporates.length <= 1) {
    return (
      <div className={className}>
        <div className="max-w-xl">
          <Listbox
            data={[]}
            value={null}
            placeholder="Error loading corporates"
            onChange={() => {}}
            displayField="name"
            disabled={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="max-w-xl">
        <Listbox
          data={corporates}
          value={selected}
          placeholder="Select Corporate"
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

// Export the component (removed the corporates array export since it's now dynamic)
export { CorporateSelect };