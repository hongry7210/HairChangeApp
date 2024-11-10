// src/components/ResultView.js
import React from 'react';

function ResultView() {
  const resultPhoto = localStorage.getItem('resultPhoto');

  return (
    <div className="container">
      <h1>결과 이미지</h1>
      {resultPhoto ? (
        <img src={resultPhoto} alt="결과" className="result-image" />
      ) : (
        <p>결과 사진이 없습니다.</p>
      )}
    </div>
  );
}

export default ResultView;
