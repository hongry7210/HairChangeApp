// src/components/PhotoUpload.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PhotoUpload.css'; // 스타일링을 위한 CSS 파일

const PhotoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64Data, setBase64Data] = useState(null); // Base64 데이터를 저장할 상태 변수
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // 이미지 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 형식 제한 (예: 이미지 파일만 허용)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('JPEG, PNG, GIF 형식의 이미지만 업로드 가능합니다.');
        return;
      }

      // 파일 크기 제한 (예: 5MB 이하)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('5MB 이하의 이미지만 업로드 가능합니다.');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        const base64String = reader.result.split(',')[1]; // 'data:image/png;base64,...' 부분 제거
        setBase64Data(base64String);
      };
      reader.onerror = () => {
        alert('이미지를 읽는 중 오류가 발생했습니다.');
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 업로드 핸들러
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('업로드할 이미지를 선택해주세요.');
      return;
    }

    if (!base64Data) {
      alert('이미지 데이터를 가져오는 중 문제가 발생했습니다.');
      return;
    }

    const payload = {
      image: base64Data, // 백엔드가 'image' 키를 기대
      name: selectedFile.name || 'image.jpg',
      type: selectedFile.type || 'image/jpeg',
    };

    setIsUploading(true);

    try {
      const response = await fetch('http://3.36.143.220:8080/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 헤더 추가
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // 서버가 JSON 형식의 오류 메시지를 반환한다고 가정
        let errorMessage = '사진 업로드에 실패했습니다.';
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
        } else {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        }
        throw new Error(errorMessage);
      }

      // 서버가 성공 시, 텍스트 형식의 응답을 반환
      const successText = await response.text();
      alert(successText || '이미지가 성공적으로 업로드되었습니다.');
      console.log('성공:', successText);
      setSelectedFile(null); // 업로드 후 이미지 초기화
      setPreviewUrl(null);
      setBase64Data(null);
      navigate('/hairstyles'); // 업로드 완료 후 이동할 경로 확인 필요
    } catch (error) {
      console.error('업로드 오류:', error);
      alert(`이미지 업로드 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="photo-upload-container">
      <h1>사진 업로드</h1>
      <div className="image-box" onClick={() => document.getElementById('fileInput').click()}>
        {previewUrl ? (
          <img src={previewUrl} alt="Selected" className="preview-image" />
        ) : (
          <div className="placeholder">
            <span>사진을 선택해주세요</span>
          </div>
        )}
        {selectedFile && (
          <button
            className="remove-button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
              setPreviewUrl(null);
              setBase64Data(null);
            }}
          >
            &times;
          </button>
        )}
      </div>
      <input
        type="file"
        id="fileInput"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
      >
        {isUploading ? <div className="spinner"></div> : '업로드'}
      </button>
    </div>
  );
};

export default PhotoUpload;
