<!DOCTYPE html>
<html>
<head>
    <title>Devis PDF</title>
</head>
<body>
    <h1>Devis #{{ $devis->id }}</h1>
    <p>Date: {{ $devis->date_devis }}</p>
    <p>Total HT: {{ $devis->Total_HT }}</p>
    <p>Total TTC: {{ $devis->Total_TTC }}</p>
    <p>TVA: {{ $devis->TVA }}</p>
</body>
</html>


