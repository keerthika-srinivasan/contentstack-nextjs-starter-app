import React, { useState } from 'react';

const StarRating = ({ value, updateValue }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => updateValue(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{
            fontSize: '30px',
            cursor: 'pointer',
            color: star <= (hover || value) ? '#ffc107' : '#e4e5e9',
            transition: 'color 200ms'
          }}
        >
          &#9733;
        </span>
      ))}
      <span style={{ marginLeft: '10px', alignSelf: 'center', color: '#666' }}>
        ({value || 0} / 5)
      </span>
    </div>
  );
};

export default StarRating;