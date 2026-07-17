"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Plus, Trash2, Star, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackButton } from "@/components/shared/back-button";
import { useCustomerStore } from "@/store/customer";
import type { Address } from "@/lib/types";

const emptyAddress = {
  label: "",
  firstName: "",
  lastName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "IN",
};

export default function AddressesPage() {
  const { profile, addAddress, updateAddress, removeAddress, setDefaultShipping } = useCustomerStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyAddress);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!profile) {
    return (
      <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto text-center py-24">
          <MapPin className="w-12 h-12 text-muted mx-auto mb-4" />
          <h1 className="text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-heading), serif" }}>
            Sign In Required
          </h1>
          <p className="text-sm text-muted">Please sign in to manage your addresses.</p>
        </div>
      </section>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.line1.trim()) e.line1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.zip.trim()) e.zip = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingId) {
      updateAddress(editingId, {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country,
      });
    } else {
      addAddress({
        label: form.label || form.city || "Home",
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        zip: form.zip,
        country: form.country,
        isDefaultShipping: profile.addresses.length === 0,
        isDefaultBilling: profile.addresses.length === 0,
      });
    }
    setForm(emptyAddress);
    setIsAdding(false);
    setEditingId(null);
    setErrors({});
  };

  const startEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      firstName: addr.firstName,
      lastName: addr.lastName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      state: addr.state,
      zip: addr.zip,
      country: addr.country,
    });
    setEditingId(addr.id);
    setIsAdding(true);
  };

  const inputProps = (field: keyof typeof form, placeholder: string) => ({
    placeholder,
    value: form[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [field]: e.target.value })),
    className: errors[field] ? "border-red-500" : "",
  });

  return (
    <section className="pt-32 lg:pt-40 pb-24 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <BackButton />
          <div className="flex items-center justify-between">
            <h1 className="text-4xl md:text-5xl font-semibold" style={{ fontFamily: "var(--font-heading), serif" }}>
              Addresses
            </h1>
            {!isAdding && (
              <Button variant="primary" onClick={() => { setIsAdding(true); setEditingId(null); setForm(emptyAddress); }} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                ADD
              </Button>
            )}
          </div>
        </motion.div>

        {isAdding && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mb-8 p-6 bg-card border border-border rounded-[2px]">
            <h2 className="text-lg font-medium mb-6">{editingId ? "Edit Address" : "New Address"}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Input {...inputProps("firstName", "First name")} />{errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}</div>
                <div><Input {...inputProps("lastName", "Last name")} />{errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}</div>
              </div>
              <div><Input {...inputProps("phone", "Phone")} />{errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}</div>
              <div><Input {...inputProps("line1", "Address line 1")} />{errors.line1 && <p className="text-xs text-red-500 mt-1">{errors.line1}</p>}</div>
              <Input {...inputProps("line2", "Address line 2 (optional)")} />
              <div className="grid grid-cols-3 gap-4">
                <div><Input {...inputProps("city", "City")} />{errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}</div>
                <div><Input {...inputProps("state", "State")} />{errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}</div>
                <div><Input {...inputProps("zip", "Postal code")} />{errors.zip && <p className="text-xs text-red-500 mt-1">{errors.zip}</p>}</div>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" onClick={handleSave}>{editingId ? "UPDATE" : "SAVE"}</Button>
                <Button variant="secondary" onClick={() => { setIsAdding(false); setEditingId(null); }}>CANCEL</Button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-2xl space-y-4">
          {profile.addresses.length === 0 && !isAdding && (
            <div className="p-12 text-center bg-card border border-border rounded-[2px]">
              <MapPin className="w-10 h-10 text-muted mx-auto mb-4" />
              <p className="text-sm text-muted">No addresses saved yet.</p>
            </div>
          )}
          {profile.addresses.map((addr, i) => (
            <motion.div key={addr.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 bg-card border border-border rounded-[2px]">
              <div className="flex items-start justify-between">
                <div className="text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{addr.firstName} {addr.lastName}</p>
                    {addr.isDefaultShipping && <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded">Default</span>}
                  </div>
                  <p className="text-muted">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                  <p className="text-muted">{addr.city}, {addr.state} {addr.zip}</p>
                  <p className="text-muted">{addr.country} — {addr.phone}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!addr.isDefaultShipping && (
                    <button onClick={() => setDefaultShipping(addr.id)} className="p-1.5 text-muted hover:text-gold transition-colors" title="Set default shipping">
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => startEdit(addr)} className="p-1.5 text-muted hover:text-gold transition-colors" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeAddress(addr.id)} className="p-1.5 text-muted hover:text-red-500 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
