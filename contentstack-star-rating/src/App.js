import React, { useState, useEffect } from 'react';
import ContentstackAppSDK from '@contentstack/app-sdk';
import StarRating from './StarRating';

function App() {
  const [sdk, setSdk] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    ContentstackAppSDK.init().then((appSdk) => {
      setSdk(appSdk);
      // Get the existing rating from Contentstack (if it exists)
      const existingData = appSdk.location.CustomField.field.getData();
      setRating(existingData || 0);

      // Important: Auto-resize the iframe height to fit the stars
      appSdk.location.CustomField.frame.updateHeight(50);
    });
  }, []);

  const handleUpdate = (newRating) => {
    setRating(newRating);
    if (sdk) {
      // Save the new rating back to the entry
      sdk.location.CustomField.field.setData(newRating);
    }
  };

  if (!sdk) return <div>Loading Star Rating...</div>;

  return (
    <div className="App" style={{ padding: '5px' }}>
      <StarRating value={rating} updateValue={handleUpdate} />
    </div>
  );
}

export default App;