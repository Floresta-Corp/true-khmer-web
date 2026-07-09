export interface CountryOption {
  value: string;
  label: string;
  idFormat?: {
    name: string;
    regex: RegExp;
    mask?: string;
    maxLength?: number;
    placeholder: string;
  };
}

export const countries: CountryOption[] = [
  {
    value: "AR",
    label: "Argentina",
    idFormat: {
      name: "DNI",
      regex: /^\d{7,8}$/,
      mask: "99999999",
      maxLength: 8,
      placeholder: "Enter 7 or 8-digit DNI"
    }
  },
  {
    value: "AU",
    label: "Australia",
    idFormat: {
      name: "TFN",
      regex: /^\d{3} \d{3} \d{3}$/,
      mask: "999 999 999",
      maxLength: 11,
      placeholder: "e.g. 123 456 789"
    }
  },
  {
    value: "BR",
    label: "Brazil",
    idFormat: {
      name: "CPF",
      regex: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      mask: "999.999.999-99",
      maxLength: 14,
      placeholder: "e.g. 123.456.789-09"
    }
  },
  {
    value: "KH",
    label: "Cambodia",
    idFormat: {
      name: "National ID",
      regex: /^\d{3}-\d{6}-\d{1}$/,
      mask: "999-999999-9",
      maxLength: 12,
      placeholder: "e.g. 123-456789-0"
    }
  },
  {
    value: "CA",
    label: "Canada",
    idFormat: {
      name: "SIN",
      regex: /^\d{3} \d{3} \d{3}$/,
      mask: "999 999 999",
      maxLength: 11,
      placeholder: "e.g. 123 456 789"
    }
  },
  {
    value: "CL",
    label: "Chile",
    idFormat: {
      name: "RUT",
      regex: /^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/,
      mask: "99.999.999-9",
      maxLength: 12,
      placeholder: "e.g. 12.345.678-5"
    }
  },
  {
    value: "CN",
    label: "China",
    idFormat: {
      name: "Resident ID",
      regex: /^\d{17}[\dXx]$/,
      mask: "9999999999999999X",
      maxLength: 18,
      placeholder: "e.g. 11010219900123456X"
    }
  },
  {
    value: "CO",
    label: "Colombia",
    idFormat: {
      name: "Cédula de Ciudadanía",
      regex: /^\d{6,10}$/,
      mask: "9999999999",
      maxLength: 10,
      placeholder: "Enter 6-10 digit ID Number"
    }
  },
  {
    value: "DK",
    label: "Denmark",
    idFormat: {
      name: "CPR Number",
      regex: /^\d{6}-\d{4}$/,
      mask: "999999-9999",
      maxLength: 11,
      placeholder: "e.g. 010203-1234"
    }
  },
  {
    value: "FR",
    label: "France",
    idFormat: {
      name: "NIR",
      regex: /^\d{15}$/,
      mask: "9 99 99 99 999 999 99",
      maxLength: 18,
      placeholder: "e.g. 1 23 45 67 890 123 45"
    }
  },
  {
    value: "DE",
    label: "Germany",
    idFormat: {
      name: "Personalausweis",
      regex: /^[0-9A-Za-z]{9}$/,
      mask: "AAAAAAAAA",
      maxLength: 9,
      placeholder: "e.g. L01X00T47"
    }
  },
  {
    value: "HK",
    label: "Hong Kong",
    idFormat: {
      name: "HKID",
      regex: /^[A-Za-z]{1,2}\d{6}\(\d[A]\)$/,
      mask: "AA999999(9)",
      maxLength: 11,
      placeholder: "e.g. AB123456(3)"
    }
  },
  {
    value: "IN",
    label: "India",
    idFormat: {
      name: "Aadhaar",
      regex: /^\d{12}$/,
      mask: "9999 9999 9999",
      maxLength: 14,
      placeholder: "e.g. 1234 5678 9012"
    }
  },
  {
    value: "ID",
    label: "Indonesia",
    idFormat: {
      name: "NIK",
      regex: /^\d{16}$/,
      mask: "9999999999999999",
      maxLength: 16,
      placeholder: "e.g. 3207061504940001"
    }
  },
  {
    value: "IL",
    label: "Israel",
    idFormat: {
      name: "Teudat Zehut",
      regex: /^\d{9}$/,
      mask: "999999999",
      maxLength: 9,
      placeholder: "Enter 9-digit ID Number"
    }
  },
  {
    value: "IT",
    label: "Italy",
    idFormat: {
      name: "Codice Fiscale",
      regex: /^[A-Za-z]{6}\d{2}[A-Za-z]\d{2}[A-Za-z]\d{3}[A-Za-z]$/i,
      mask: "AAAAAA99A99A999A",
      maxLength: 16,
      placeholder: "e.g. RSSMRA80A01H501U"
    }
  },
  {
    value: "JP",
    label: "Japan",
    idFormat: {
      name: "My Number",
      regex: /^\d{4}-\d{4}-\d{4}$/,
      mask: "9999-9999-9999",
      maxLength: 14,
      placeholder: "e.g. 1234-5678-9012"
    }
  },
  {
    value: "MX",
    label: "Mexico",
    idFormat: {
      name: "CURP",
      regex: /^[A-Za-z]{4}\d{6}[HM][A-Za-z]{5}[\dA-Za-z]\d$/i,
      mask: "AAAA999999AAAAAA99",
      maxLength: 18,
      placeholder: "e.g. GOME901231HDFRNS09"
    }
  },
  {
    value: "NL",
    label: "Netherlands",
    idFormat: {
      name: "BSN",
      regex: /^\d{9}$/,
      mask: "999999999",
      maxLength: 9,
      placeholder: "e.g. 123456782"
    }
  },
  {
    value: "NZ",
    label: "New Zealand",
    idFormat: {
      name: "IRD Number",
      regex: /^\d{3}-\d{3}-\d{3}$|^\d{2}-\d{3}-\d{3}$/,
      mask: "999-999-999",
      maxLength: 11,
      placeholder: "e.g. 123-456-789"
    }
  },
  {
    value: "NG",
    label: "Nigeria",
    idFormat: {
      name: "National ID Number",
      regex: /^\d{11}$/,
      mask: "99999999999",
      maxLength: 11,
      placeholder: "Enter 11-digit National ID Number"
    }
  },
  {
    value: "NO",
    label: "Norway",
    idFormat: {
      name: "Fødselsnummer",
      regex: /^\d{6} \d{5}$/,
      mask: "999999 99999",
      maxLength: 12,
      placeholder: "e.g. 010203 12345"
    }
  },
  {
    value: "PH",
    label: "Philippines",
    idFormat: {
      name: "PhilSys ID",
      regex: /^\d{4}-\d{4}-\d{4}$/,
      mask: "9999-9999-9999",
      maxLength: 14,
      placeholder: "e.g. 1234-5678-9012"
    }
  },
  {
    value: "PL",
    label: "Poland",
    idFormat: {
      name: "PESEL",
      regex: /^\d{11}$/,
      mask: "99999999999",
      maxLength: 11,
      placeholder: "e.g. 83010112345"
    }
  },
  {
    value: "RU",
    label: "Russia",
    idFormat: {
      name: "Passport",
      regex: /^\d{4} \d{6}$/,
      mask: "9999 999999",
      maxLength: 11,
      placeholder: "e.g. 4509 123456"
    }
  },
  {
    value: "SG",
    label: "Singapore",
    idFormat: {
      name: "NRIC",
      regex: /^[STFG]\d{7}[A-Za-z]$/,
      mask: "S9999999A",
      maxLength: 9,
      placeholder: "e.g. S1234567D"
    }
  },
  {
    value: "ZA",
    label: "South Africa",
    idFormat: {
      name: "ID Number",
      regex: /^\d{13}$/,
      mask: "9999999999999",
      maxLength: 13,
      placeholder: "e.g. 8001015009087"
    }
  },
  {
    value: "KR",
    label: "South Korea",
    idFormat: {
      name: "Resident Registration Number",
      regex: /^\d{6}-[1-4]\d{6}$/,
      mask: "999999-9999999",
      maxLength: 14,
      placeholder: "e.g. 900101-1234567"
    }
  },
  {
    value: "ES",
    label: "Spain",
    idFormat: {
      name: "DNI",
      regex: /^\d{8}-[A-Za-z]$/,
      mask: "99999999-A",
      maxLength: 10,
      placeholder: "e.g. 12345678-Z"
    }
  },
  {
    value: "LK",
    label: "Sri Lanka",
    idFormat: {
      name: "NIC",
      regex: /^(\d{9}[VvXx]|\d{12})$/,
      mask: "999999999V",
      maxLength: 10,
      placeholder: "e.g. 880000000V"
    }
  },
  {
    value: "SE",
    label: "Sweden",
    idFormat: {
      name: "Personal Number",
      regex: /^\d{6}-\d{4}$|^\d{8}-\d{4}$/,
      mask: "999999-9999",
      maxLength: 11,
      placeholder: "e.g. 900101-1234"
    }
  },
  {
    value: "CH",
    label: "Switzerland",
    idFormat: {
      name: "AHV/AVS",
      regex: /^756\.\d{4}\.\d{4}\.\d{2}$/,
      mask: "756.9999.9999.99",
      maxLength: 16,
      placeholder: "e.g. 756.1234.5678.90"
    }
  },
  {
    value: "TW",
    label: "Taiwan",
    idFormat: {
      name: "National ID",
      regex: /^[A-Za-z]\d{9}$/,
      mask: "A999999999",
      maxLength: 10,
      placeholder: "e.g. A123456789"
    }
  },
  {
    value: "TH",
    label: "Thailand",
    idFormat: {
      name: "Citizen ID",
      regex: /^\d{1}-\d{4}-\d{5}-\d{2}-\d{1}$/,
      mask: "9-9999-99999-99-9",
      maxLength: 17,
      placeholder: "e.g. 1-2345-67890-12-3"
    }
  },
  {
    value: "TR",
    label: "Turkey",
    idFormat: {
      name: "T.C. Kimlik No",
      regex: /^\d{11}$/,
      mask: "99999999999",
      maxLength: 11,
      placeholder: "e.g. 12345678901"
    }
  },
  {
    value: "AE",
    label: "United Arab Emirates",
    idFormat: {
      name: "Emirates ID",
      regex: /^784-\d{4}-\d{7}-\d{1}$/,
      mask: "784-9999-9999999-9",
      maxLength: 18,
      placeholder: "e.g. 784-1234-5678901-2"
    }
  },
  {
    value: "GB",
    label: "United Kingdom",
    idFormat: {
      name: "National Insurance Number",
      regex: /^(?![DFIQUV])[A-Za-z](?![DFIQUVO])[A-Za-z]\d{6}[A-Da-d]$/,
      mask: "AA 999999 A",
      maxLength: 11,
      placeholder: "e.g. AB 123456 C"
    }
  },
  {
    value: "US",
    label: "United States",
    idFormat: {
      name: "SSN",
      regex: /^\d{3}-\d{2}-\d{4}$/,
      mask: "999-99-9999",
      maxLength: 11,
      placeholder: "e.g. 123-45-6789"
    }
  },
  {
    value: "VN",
    label: "Vietnam",
    idFormat: {
      name: "Citizen ID",
      regex: /^\d{3} \d{3} \d{3} \d{3}$/,
      mask: "999 999 999 999",
      maxLength: 15,
      placeholder: "e.g. 123 456 789 012"
    }
  },
  {
    value: "OTHER",
    label: "Other",
    idFormat: {
      name: "ID/Passport",
      regex: /^.{3,20}$/,
      maxLength: 20,
      placeholder: "Enter ID or Passport Number"
    }
  }
]

