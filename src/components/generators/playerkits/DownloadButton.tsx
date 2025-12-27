import React from 'react';
import { useStore } from '@nanostores/react';
import { kitYamlStore, kitNameStore } from '@/lib/generators/playerkits/store';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const DownloadButton: React.FC = () => {
  const yaml = useStore(kitYamlStore);
  const kitName = useStore(kitNameStore);

  const handleDownload = () => {
    if (!yaml) return;
    
    // Clean kit name for filename
    const fileName = (kitName || 'starter').replace(/[^a-z0-9]/gi, '_');
    
    const blob = new Blob([yaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.yml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-2"
      onClick={handleDownload}
       disabled={!yaml}
    >
      <Download className="w-4 h-4" />
      Download Kit
    </Button>
  );
};
