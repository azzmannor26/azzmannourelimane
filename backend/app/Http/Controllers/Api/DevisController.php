<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devis;
use Illuminate\Http\Request;
use Elibyy\TCPDF\Facades\TCPDF as TCPDF; 
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;

class DevisController extends Controller
{
    public function generateDevis(Request $request)
{
    $devis = Devis::create([
        'date_devis' => now(),
        'Total_HT' => $request->Total_HT,
        'Total_TTC' => $request->Total_TTC,
        'TVA' => $request->TVA,
    ]);

    // Générer le contenu HTML en utilisant une vue Blade
    $html = View::make('devis_pdf', compact('devis'))->render();

    // Créer un nouveau document PDF
    TCPDF::SetTitle('Devis');
    TCPDF::AddPage();
    TCPDF::writeHTML($html, true, false, true, false, '');

    $fileName = 'devis_' . $devis->id . '.pdf';
    $filePath = public_path('storage/' . $fileName);

    // Sauvegarder le fichier PDF
    TCPDF::Output($filePath, 'F');

    // Vérifiez que le fichier a été enregistré
    if (file_exists($filePath)) {
        $devis->update(['devis_pdf' => $fileName]);
        return response()->json(['message' => 'Devis created and PDF generated successfully', 'devis' => $devis], 201);
    } else {
        return response()->json(['message' => 'Failed to generate PDF'], 500);
    }
}


    public function downloadDevis($id)
    {
        $devis = Devis::findOrFail($id);
        $filePath = public_path('storage/' . $devis->devis_pdf);

        // Vérifiez que le fichier existe avant de le télécharger
        if (file_exists($filePath)) {
            return response()->download($filePath);
        } else {
            return response()->json(['message' => 'File not found'], 404);
        }
    }
}
