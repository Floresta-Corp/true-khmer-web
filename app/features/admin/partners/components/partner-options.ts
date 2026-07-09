import {
  partnerEmployeePositionOptions,
  partnerSectorOptions,
} from "~/features/partner-registration/data/sector-options";
import { tiers } from "~/features/partner-registration/data/tiers";

export { partnerEmployeePositionOptions, partnerSectorOptions };

export const packageOptions = tiers.map((tier) => ({
  value: tier.name,
  label: `${tier.name} - ${tier.price}`,
}));

export const packageKmOptions = [
  { value: "ប្លាទីន", label: "ប្លាទីន" },
  { value: "មាស", label: "មាស" },
  { value: "ប្រាក់", label: "ប្រាក់" },
  { value: "សំរិទ្ធ", label: "សំរិទ្ធ" },
  { value: "រដ្ឋាភិបាល", label: "រដ្ឋាភិបាល" },
  { value: "SME", label: "SME" },
  { value: "វីដេអូ", label: "វីដេអូ" },
  { value: "ឥតគិតថ្លៃ", label: "ឥតគិតថ្លៃ" },
];
