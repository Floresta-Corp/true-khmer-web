import { useState } from "react";
import { Check, CheckCircle2, Copy, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type CreatedUser = {
  email: string;
  password: string;
};

type AddUserModalProps = {
  show: boolean;
  createdUser: CreatedUser | null;
  onClose: () => void;
  setCreatedUser: (value: CreatedUser | null) => void;
};

export function AddUserModal({
  show,
  createdUser,
  onClose,
  setCreatedUser,
}: AddUserModalProps) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-md h-fit bg-white dark:bg-[#020617] rounded-2xl shadow-2xl z-[101] overflow-hidden"
      >
        {createdUser ? (
          <CreatedUserSuccess
            createdUser={createdUser}
            onClose={() => {
              onClose();
              setCreatedUser(null);
            }}
          />
        ) : (
          <CreateUserForm onClose={onClose} setCreatedUser={setCreatedUser} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function CreateUserForm({
  onClose,
  setCreatedUser,
}: {
  onClose: () => void;
  setCreatedUser: (value: CreatedUser | null) => void;
}) {
  return (
    <>
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Add New User
        </h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X size={18} className="text-slate-400" />
        </button>
      </div>
      <form
        className="p-6 space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          setCreatedUser({
            email: formData.get("email") as string,
            password:
              (formData.get("password") as string) || "TemporaryP@ssw0rd123",
          });
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="First Name"
            name="firstName"
            placeholder="e.g. John"
          />
          <InputField
            label="Last Name"
            name="lastName"
            placeholder="e.g. Smith"
          />
        </div>
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="john@example.com"
        />
        <InputField
          label="Temporary Password"
          name="password"
          type="password"
          placeholder="••••••••"
        />
        <button
          type="submit"
          className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          Confirm & Create Account
        </button>
      </form>
    </>
  );
}

function CreatedUserSuccess({
  createdUser,
  onClose,
}: {
  createdUser: CreatedUser;
  onClose: () => void;
}) {
  return (
    <div className="p-8 text-center bg-white dark:bg-[#020617]">
      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={40} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        Account Created
      </h3>
      <p className="text-slate-500 text-sm mb-8 px-4">
        The user was successfully added. Share the credentials below.
      </p>

      <div className="space-y-4 mb-8">
        <CredentialField label="Email Address" value={createdUser.email} />
        <CredentialField
          label="Temporary Password"
          value={createdUser.password}
        />
      </div>

      <button
        onClick={onClose}
        className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
      >
        Close & Go to Dashboard
      </button>
    </div>
  );
}

function InputField({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
        {label}
      </label>
      <input
        name={name}
        required
        type={type}
        placeholder={placeholder}
        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:border-blue-500 transition-all"
      />
    </div>
  );
}

function CredentialField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-1.5 text-left">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
        {label}
      </label>
      <div className="relative group">
        <input
          readOnly
          value={value}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl py-3.5 pl-4 pr-12 text-sm font-medium text-slate-900 dark:text-slate-100"
        />
        <button
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-600 transition-all"
        >
          {copied ? (
            <Check size={16} className="text-emerald-500" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
