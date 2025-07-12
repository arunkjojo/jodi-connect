import React, { useState } from 'react';
import { Upload, Trash2, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { importLocationData, clearLocationData } from '../../services/firebase/dataImport';
import toast from 'react-hot-toast';

const DataImportPanel: React.FC = () => {
  const [importing, setImporting] = useState(false);
  const [clearing, setClearning] = useState(false);

  const handleImportData = async () => {
    setImporting(true);
    try {
      const result = await importLocationData();
      toast.success(`Successfully imported ${result.statesCount} states and ${result.districtsCount} districts`);
      console.log('Import result:', result);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import location data');
    } finally {
      setImporting(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear all location data? This action cannot be undone.')) {
      return;
    }

    setClearning(true);
    try {
      const result = await clearLocationData();
      toast.success(`Successfully cleared ${result.deletedStates} states and ${result.deletedDistricts} districts`);
      console.log('Clear result:', result);
    } catch (error) {
      console.error('Clear error:', error);
      toast.error('Failed to clear location data');
    } finally {
      setClearning(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-6">
        <Database className="w-6 h-6 text-blue-500 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Location Data Management</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-blue-900">Import Location Data</h3>
              <p className="text-sm text-blue-700 mt-1">
                Import states and districts data into Firestore collections.
              </p>
            </div>
          </div>
          <button
            onClick={handleImportData}
            disabled={importing}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            {importing ? 'Importing...' : 'Import Data'}
          </button>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-red-900">Clear Location Data</h3>
              <p className="text-sm text-red-700 mt-1">
                Remove all states and districts data from Firestore. This action cannot be undone.
              </p>
            </div>
          </div>
          <button
            onClick={handleClearData}
            disabled={clearing}
            className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {clearing ? 'Clearing...' : 'Clear Data'}
          </button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Data Structure</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>States Collection:</strong> id, name, localName, available</p>
          <p>• <strong>Districts Collection:</strong> id, name, localName, available, stateId</p>
        </div>
      </div>
    </div>
  );
};

export default DataImportPanel;