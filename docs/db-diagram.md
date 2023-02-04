# Database diagram

The database schema is described below. Every table is represented by a class in the class diagrams.

## Common entities

```mermaid
  classDiagram

  class Environment {
    <<enumeration>>
    sandbox,
    live
  }
```

### JSON models

```typescript
type LocalizedString = {
  [locale: string]: string;
};
```

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
    name: varchar
    slug: text [unique]
    logo_url: text | null
    locales: jsonb~Locales~
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
    external_id: varchar | null
    organization_id: uuid
    environment: Environment
    ---
    fiscal_year: smallint
    reason: varchar | null
    type: DonationType
    currency: varchar3
    source: DonationSource
    ---
    donor_first_name: varchar | null
    donor_last_name_or_org_name: varchar
    donor_email: varchar | null
    donor_address: jsonb~Address~ | null
    ---
    should_emit_receipt: boolean
    should_email_receipt: boolean
    receipt_status: ReceiptStatus | null
    ---

    ix(organization_id, environment)
    fk_organizations(organization_id => organizations.id, RESTRICT)
  }

  donations "*" -- "1" organizations

  class DonationType {
    <<enumeration>>
    oneTime,
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

  class DonationSource {
    <<enumeration>>
    paypal,
    cheque,
    directDeposit,
    stocks,
    other
  }

  DonationSource -- donations

  class donation_entries {
    <<create, archive>>
    id: uuid [pk]
    external_id: varchar | null;
    donation_id: uuid [fk]
    amount: bigint
    receipt_amount: bigint

    received_at: timestampz

    fk(donation_id => donations.id, CASCADE)
  }

  donations "1" -- "1...*" donation_entries

  class donation_receipts {
    <<create, archive>>
    id: uuid [pk]
    donation_id: uuid [fk]
    type: ReceiptType
    revision: smallint | null

    file_uri: text | null

    fk(donation_id => donations.id, CASCADE)
  }

  donations "1" -- "0...*" donation_receipts

  donation_receipts -- ReceiptType

  class ReceiptType {
    <<enumeration>>
    original,
    revision
  }

  class correspondences {
    <<create>>
    id: uuid [pk]
    donation_id: uuid [fk]
    type: CorrespondenceType
    status: CorrespondenceStatus

    sent_to: varchar
    sent_at: timestampz

    fk(donation_id => donations.id, CASCADE)
  }

  correspondences "0...*" -- "1" donations

  class CorrespondenceType {
    <<enumeration>>
    noAddressReminder,
    receipt
  }

  CorrespondenceType -- correspondences

  class CorrespondenceStatus {
    <<enumeration>>
    inProgress,
    done,
    error
  }

  CorrespondenceStatus -- correspondences

  class correspondences_attached_receipts {
    correspondence_id: uuid [fk]
    receipt_id: uuid [fk]

    fk(correspondence_id => correspondences.id, CASCADE)
    fk(receipt_id => receipts.id, CASCADE)
  }

  correspondences "*" -- "*" correspondences_attached_receipts
  donation_receipts "*" -- "*" correspondences_attached_receipts

  class donation_comments {
    <<create, archive>>
    id: uuid [pk]
    donation_id: uuid [fk]

    comment: text
    author: varchar
  }

  donations "1" -- "0...*" donation_comments
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
```
