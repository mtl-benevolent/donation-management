# Database diagram

The database schema is described below. Every table is represented by a class in the class diagrams.

## 🐾 Tracing

Tracing fields can be appended to database entities. Those traces add the described fields on the attached entity.

```mermaid
  classDiagram

  class Create {
    created_at: timestamp
    created_by: varchar255
  }

  class Update {
    updated_at: timestamp | null
    updated_by: varchar255 | null
  }

  class Archive {
    archived_at: timestamp | null
    archived_by: varchar255 | null
  }
```

## 🔐 Organizations, Templates & Settings

Organizations are the primary entity of the system. Donations, templates and other settings are attached to them.

Templates allow organizations to customize the content of the generated artifacts (receipts and emails) so it matches their branding.

```mermaid
  classDiagram

  class organizations {
    <<create, update, archive>>
    id: uuid [pk]
    name: varchar255
    slug: varchar1024 [unique]
    logo_url: text | null
    locales: jsonb~locales~

    smtpSettings: jsonb~SmtpSettings~ | null
  }

  class templates {
    <<create>>
    organization_id: uuid [pk]
    usage: TemplateUsage [pk]
    dialect: TemplateDialect

    fk_organizations(organizations.id, organization_id, CASCADE)
  }
  templates "*" -- "1" organizations

  class TemplateUsage {
    <<enumeration>>
    receipt,
    no_address_email,
    receipt_email
  }

  TemplateUsage -- templates

  class TemplateDialect {
    <<enumeration>>
    handlebars,
    mjml_handlebars
  }

  TemplateDialect -- templates

  class template_versions {
    <<create, update>>
    id: uuid [pk]
    template_id: uuid

    template: text
    translations: jsonb~TemplateTranslations~

    published_at: timestamp | null
    published_by: varchar255 | null

    fk_templates(templates.id, template_id, CASCADE)
  }

  template_versions "*" -- "1" templates
```

### JSON objects

```typescript
type Locales {
  locales: string[]
}

type SmtpSettings {
  host: string
  port: number
  secure: boolean
  username: string
  password: string  // Must be encrypted (use AES-256)
  from: string | null
  replyTo: string | null
}

type LocalizedString = Record<string, string>

type TemplateTranslations = Record<string, LocalizedString>
```

## 💵 Donations

Donations record the action of a donor who gives money. Donations come in two modes: one-time donations and recurring donations.

One-time donations record the donation and produce the receipts immediately after.

Recurring donations record donations made throughout the year. Only once the fiscal year is closed are all receipts produced and sent.

```mermaid
  classDiagram

  class donations {
    <<create, update, archive>>
    id: uuid [pk]
    organizationId: uuid
    ---
    fiscal_year: smallint
    reason: varchar | null
    type: DonationType
    currency: varchar3
    ---
    donor_first_name: varchar | null
    donor_last_name_or_org_name: varchar
    donor_email: varchar320
    donor_address: jsonb~Address~ | null
    ---
    entries: jsonb~DonationEntries~
    ---
    receipts: jsonb~DonationReceipts~
    receipt_status: ReceiptStatus | null;
    ---
    correspondences: jsonb~DonationCorrespondences~
    ---
    comments: jsonb~DonationComments~

    fk_organizations(organizations.id, organization_id, CASCADE)
  }

  donations "*" -- "1" organizations

  class DonationType {
    <<enumeration>>
    one-time,
    recurrent
  }

  DonationType -- donations

  class ReceiptStatus {
    <<enumeration>>
    inProgress,
    done,
    error
  }

  ReceiptStatus -- donations
```

### JSON Objects

```typescript
type Address = {
  line1: string;
  line2: string | null;
  city: string;
  postalCode: string;
  state: string | null;
  country: string;
};

// DonationEntries
enum DonationSource {
  paypal,
  check,
  directDeposit,
  stocks,
  other,
}

type DonationEntry = {
  id: string;
  fractionalAmount: number;
  fractionalReceiptAmount: number;

  receivedAt: Date;

  source: DonationSource;
  sourceDetails: PaypalPayment | null;
} & CreateEntity &
  ArchiveEntity;

type DonationEntries = {
  entries: DonationEntry[];
};

// Receipts
enum ReceiptType = {
  original,
  revised,
}

type Receipt = {
  id: string;
  type: ReceiptType;

  fileUri: string | null;
} & CreateEntity & ArchiveEntity;

type DonationReceipts = {
  receipts: Receipt[]
}

// Correspondences
enum CorrespondenceStatus = {
  inProgress,
  done,
  error,
}

enum CorrespondenceType = {
  noAddressReminder,
  receipt,
}

type Correspondence = {
  id: string;
  type: CorrespondenceType;
  status: CorrespondenceStatus;

  sentTo: string;
  sentAt: Date;

  attachedDocumentIds: string[];

} & CreateEntity & ArchiveEntity;

type DonationCorrespondences = {
  correspondences: Correspondence[];
}

// Comments
type Comment = {
  comment: string;
} & CreateEntity & UpdateEntity & ArchiveEntity;

type DonationComments = {
  comments: Comment[];
}
```
