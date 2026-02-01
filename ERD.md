# CWSMS Entity Relationship Diagram (ERD)

## Entities and Attributes

1. **Package**
   - PackageNumber (PK, AUTO_INCREMENT)
   - PackageName
   - PackageDescription
   - PackagePrice

2. **Car**
   - PlateNumber (PK)
   - CarType
   - CarSize
   - DriverName
   - PhoneNumber

3. **ServicePackage** (Service Record)
   - RecordNumber (PK, AUTO_INCREMENT)
   - PlateNumber (FK → Car.PlateNumber)
   - PackageNumber (FK → Package.PackageNumber)
   - ServiceDate

4. **Payment**
   - PaymentNumber (PK, AUTO_INCREMENT)
   - RecordNumber (FK → ServicePackage.RecordNumber)
   - AmountPaid
   - PaymentDate

## Relationships and Cardinalities

- **Car** 1 —— N **ServicePackage** (one car can have many service records)
- **Package** 1 —— N **ServicePackage** (one package can be used in many service records)
- **ServicePackage** 1 —— N **Payment** (one service record can have many payments; typically 1:1)

## Diagram (text)

```
    Package                    Car
    +----------------+         +----------------+
    | PackageNumber PK|         | PlateNumber PK  |
    | PackageName     |         | CarType         |
    | PackageDescription|       | CarSize         |
    | PackagePrice    |         | DriverName      |
    +--------+--------+         | PhoneNumber     |
             |                  +--------+--------+
             | 1                         |
             |                           N
             |                  +--------+--------+
             +----------------->| ServicePackage  |
                       N        +----------------+
                                | RecordNumber PK|
                                | PlateNumber FK  |
                                | PackageNumber FK|
                                | ServiceDate    |
                                +--------+--------+
                                         |
                                         | 1
                                         |
                                         N
                                +--------+--------+
                                | Payment         |
                                +----------------+
                                | PaymentNumber PK|
                                | RecordNumber FK  |
                                | AmountPaid      |
                                | PaymentDate     |
                                +----------------+
```

Draw this ERD on plain paper with pencils before using the computer, indicating cardinalities (1, N) and relationship lines with correct symbols as required by the assessment.
