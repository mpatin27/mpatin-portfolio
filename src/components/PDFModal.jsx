import React from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { CVPDF } from './CVPDF';

export default function PDFModal({ isOpen, onClose, profile, cvItems, qrCodeUrl }) {
  if (!isOpen) return null;

  const fileName = `CV_${profile?.full_name ? profile.full_name.replace(/\s+/g, '_') : 'Portfolio'}.pdf`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      
      <div className="bg-slate-900 w-full h-full max-w-6xl max-h-[90vh] rounded-lg border border-slate-700 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* HEADER MODAL */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-950">
          <h2 className="text-green-500 font-mono font-bold flex items-center gap-2">
            <span className="text-xl">📄</span> PREVIEW_MODE
          </h2>
          
          <div className="flex gap-4 items-center">
             
             {/* BOUTON TÉLÉCHARGER AVEC NOM FORCÉ */}
             <PDFDownloadLink
               document={<CVPDF profile={profile} cvItems={cvItems} qrCodeUrl={qrCodeUrl} />}
               fileName={fileName}
               className="bg-green-600 hover:bg-green-500 text-black font-bold py-2 px-4 rounded text-xs font-mono flex items-center gap-2 transition"
             >
               {({ loading }) => 
                 loading ? 'GENERATING...' : (
                   <>
                     <span>⬇</span> DOWNLOAD PDF
                   </>
                 )
               }
             </PDFDownloadLink>

             <button 
               onClick={onClose}
               className="text-slate-400 hover:text-white transition-colors font-mono text-xs border border-slate-700 hover:border-red-500 px-4 py-2 rounded hover:bg-red-500/10"
             >
               [X] CLOSE
             </button>
          </div>
        </div>

        {/* LECTEUR PDF */}
        <div className="flex-grow bg-slate-800 relative">
          <PDFViewer width="100%" height="100%" className="border-none" showToolbar={true}>
            <CVPDF profile={profile} cvItems={cvItems} qrCodeUrl={qrCodeUrl} />
          </PDFViewer>
        </div>

      </div>
    </div>
  );
}