<!DOCTYPE html>
<html>
<head>
    <title>Facture PDF</title>
</head>
<body>
    <h1>Facture #{{ $facture->id }}</h1>
    <p>Date: {{ $facture->date_facture }}</p>
    <p>Total HT: {{ $facture->total_HT }}</p>
    <p>Total TTC: {{ $facture->total_TTC }}</p>
    <p>TVA: {{ $facture->TVA }}</p>
</body>
</html>
