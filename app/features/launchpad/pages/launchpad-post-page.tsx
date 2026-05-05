import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router";
import BackToButton from "~/components/back-to-button";
import { fadeUp } from "~/components/default-animation";
import LaunchpadPostPage1 from "./launchpad-post-page-1";
import LaunchpadPostPage2 from "./launchpad-post-page-2";
import type { loader } from "../routes/launchpad.create";
import { useLaunchpadCreateStore } from "~/stores/launchpad-create-store";

enum State {
  DETAIL = "Detail",
  ROLE = "Role",
}

type DetailErrors = {
  name?: string;
  categoryId?: string;
  cityId?: string;
  deadline?: string;
  logoFile?: string;
  coverFile?: string;
};

type RoleErrors = {
  role?: string;
  materialDocuments?: string;
  email?: string;
  phoneNumber?: string;
};

function isValidEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

export default function LaunchpadPostPage() {
  const { categories, locations, defaultEmail } =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher<{
    error?: string;
    success?: boolean;
    redirectTo?: string;
  }>();
  const prefersReducedMotion = useReducedMotion();
  const state =
    searchParams.get("state")?.toLowerCase() === "role"
      ? State.ROLE
      : State.DETAIL;

  const store = useLaunchpadCreateStore();
  const [detailErrors, setDetailErrors] = useState<DetailErrors>({});
  const [roleErrors, setRoleErrors] = useState<RoleErrors>({});

  useEffect(() => {
    void store.rehydrateFiles();
  }, []);

  useEffect(() => {
    // Initialize email if not already set
    if (!store.email && defaultEmail) {
      store.setEmail(defaultEmail);
    }
  }, [defaultEmail]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success && fetcher.data.redirectTo) {
        toast.success("Launchpad project published successfully");
        store.reset();
        navigate(fetcher.data.redirectTo);
      } else if (fetcher.data.error) {
        toast.error(fetcher.data.error);
      }
    }
  }, [fetcher.state, fetcher.data, navigate]);

  const setState = (nextState: State) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextState === State.ROLE) {
      nextParams.set("state", "role");
    } else {
      nextParams.delete("state");
    }

    setSearchParams(nextParams, {
      replace: true,
      preventScrollReset: true,
    });
  };

  const onSaveClicked = () => {
    const errors: DetailErrors = {};

    if (!store.name.trim()) errors.name = "Project name is required.";
    if (!store.categoryId.trim()) errors.categoryId = "Category is required.";
    if (!store.cityId.trim()) errors.cityId = "City is required.";
    if (!store.deadline.trim()) errors.deadline = "Deadline is required.";
    if (!store.logoFile) errors.logoFile = "Project logo is required.";
    if (!store.coverFile) errors.coverFile = "Project cover is required.";

    setDetailErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setState(State.ROLE);
  };

  const onCancelClicked = () => {
    // For simplicity, we just go back to the previous page. In a real application, you might want to show a confirmation dialog here.
    window.history.back();
  };

  const onBackToDetailClicked = () => {
    setState(State.DETAIL);
  };

  const onPublishedClicked = () => {
    const errors: RoleErrors = {};

    if (store.roles.length === 0) {
      errors.role = "At least one role is required.";
    }

    if (store.materialDocuments.length === 0) {
      errors.materialDocuments = "At least one material document is required.";
    }

    if (!store.email.trim()) {
      errors.email = "Email is required.";
    } else if (!isValidEmail(store.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!store.phoneNumber.trim()) {
      errors.phoneNumber = "Phone number is required.";
    }

    setRoleErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    const submitData = {
      categoryId: store.categoryId,
      cityId: store.cityId,
      deadline: store.deadline,
      email: store.email.trim(),
      materialDocumentName: store.materialDocuments.map(
        (file: File) => file.name,
      ),
      name: store.name.trim(),
      phoneNumber: store.phoneNumber.trim(),
      role: store.roles.map((role) => ({
        name: role.name.trim(),
        capacity: role.capacity,
        description: role.description.trim() || null,
      })),
      description: store.description.trim() || null,
      telegramUsername: store.telegramUsername.trim() || null,
    };

    const multipart = new FormData();
    multipart.append("actionType", "create-launchpad");
    multipart.append("data", JSON.stringify(submitData));

    if (store.logoFile) {
      multipart.append("logoFile", store.logoFile);
    }

    if (store.coverFile) {
      multipart.append("coverFile", store.coverFile);
    }

    for (const file of store.materialDocuments) {
      multipart.append("documentFiles", file);
    }

    fetcher.submit(multipart, {
      method: "post",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10 lg:px-20">
        <section className="mx-auto w-full max-w-3xl">
          <motion.div
            className="mb-5 flex items-center justify-between"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <BackToButton to="/launchpad" />
          </motion.div>

          <motion.div
            className="my-10"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.05,
            }}
          >
            <div className="relative flex gap-3.5 transition-all items-center p-1 rounded-full">
              <motion.div
                className="h-3 w-20 bg-blue-500 rounded-full absolute top-1 left-1"
                initial={{ x: 0, y: 0 }}
                animate={{ x: state === State.DETAIL ? 0 : 80 + 13 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                }}
              />
              <div
                className="cursor-pointer h-3 w-20 bg-gray-200 rounded-full"
                onClick={() => setState(State.DETAIL)}
              />
              <div
                className="cursor-pointer h-3 w-20 bg-gray-200 rounded-full"
                onClick={() => setState(State.ROLE)}
              />
            </div>
          </motion.div>

          <motion.div
            className="my-10"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{
              duration: prefersReducedMotion ? 0 : 0.3,
              delay: prefersReducedMotion ? 0 : 0.1,
            }}
          >
            <div className="text-4xl">Launch a New Project</div>
            <div className="text-[#65758B]">
              Tell the community what you're building and who you need.
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {state === State.ROLE ? (
              <motion.div
                key={State.ROLE}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  delay: prefersReducedMotion ? 0 : 0.15,
                }}
              >
                <LaunchpadPostPage2
                  roles={store.roles}
                  roleError={roleErrors.role}
                  materialDocuments={store.materialDocuments}
                  materialDocumentError={roleErrors.materialDocuments}
                  email={store.email}
                  phoneNumber={store.phoneNumber}
                  telegramUsername={store.telegramUsername}
                  emailError={roleErrors.email}
                  phoneNumberError={roleErrors.phoneNumber}
                  onRolesChange={(roles) => store.setRoles(roles)}
                  onMaterialDocumentsChange={(files) =>
                    store.setMaterialDocuments(files)
                  }
                  onEmailChange={(value) => store.setEmail(value)}
                  onPhoneNumberChange={(value) => store.setPhoneNumber(value)}
                  onTelegramUsernameChange={(value) =>
                    store.setTelegramUsername(value)
                  }
                  onBackToDetailClicked={onBackToDetailClicked}
                  onPublishedClicked={onPublishedClicked}
                  isSubmitting={fetcher.state === "submitting"}
                />
              </motion.div>
            ) : (
              <motion.div
                key={State.DETAIL}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.3,
                  delay: prefersReducedMotion ? 0 : 0.15,
                }}
              >
                <LaunchpadPostPage1
                  name={store.name}
                  categoryId={store.categoryId}
                  cityId={store.cityId}
                  deadline={store.deadline}
                  logoFile={store.logoFile}
                  coverFile={store.coverFile}
                  description={store.description}
                  categories={
                    categories?.map((item) => ({
                      id: item.id,
                      name: item.name,
                    })) ?? []
                  }
                  cities={
                    locations?.map((item) => ({
                      id: item.id,
                      name: item.name,
                    })) ?? []
                  }
                  errors={detailErrors}
                  onNameChange={(value) => store.setName(value)}
                  onCategoryChange={(value) => store.setCategoryId(value)}
                  onCityChange={(value) => store.setCityId(value)}
                  onDeadlineChange={(value) => store.setDeadline(value)}
                  onLogoChange={(file) => store.setLogoFile(file)}
                  onCoverChange={(file) => store.setCoverFile(file)}
                  onDescriptionChange={(value) => store.setDescription(value)}
                  onSaveClicked={onSaveClicked}
                  onCancelClicked={onCancelClicked}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
