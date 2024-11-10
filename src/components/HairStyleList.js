// src/components/HairStyleList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'; // Modal 컴포넌트 임포트

// 미리 정의된 헤어스타일 데이터
const predefinedHairStyles = [
  { id: 1, name: '짧은 스타일', imageUrl: 'https://via.placeholder.com/100x100.png?text=Short' },
  { id: 2, name: '중간 스타일', imageUrl: 'https://via.placeholder.com/100x100.png?text=Medium' },
  { id: 3, name: '긴 스타일', imageUrl: 'https://via.placeholder.com/100x100.png?text=Long' },
  { id: 4, name: '컬리 스타일', imageUrl: 'https://via.placeholder.com/100x100.png?text=Curly' },
  { id: 5, name: '스트레이트 스타일', imageUrl: 'https://via.placeholder.com/100x100.png?text=Straight' },
];

function HairStyleList() {
  const [hairStyles, setHairStyles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHairStyle, setSelectedHairStyle] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 실제로는 백엔드에서 헤어스타일 목록을 가져오지만, 여기서는 미리 정의된 데이터를 사용합니다.
    setHairStyles(predefinedHairStyles);
  }, []);

  const handleSelectClick = (hairStyle) => {
    setSelectedHairStyle(hairStyle);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (!selectedHairStyle) return;

    const uploadedPhoto = localStorage.getItem('uploadedPhoto');
    if (!uploadedPhoto) {
      alert('업로드된 사진이 없습니다.');
      navigate('/');
      return;
    }

    // 선택한 헤어스타일을 원본 사진에 적용하는 로직을 구현합니다.
    const originalImage = new Image();
    originalImage.src = uploadedPhoto;
    const hairstyleImage = new Image();
    hairstyleImage.src = selectedHairStyle.imageUrl;

    originalImage.onload = () => {
      hairstyleImage.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        const ctx = canvas.getContext('2d');

        // 원본 사진 그리기
        ctx.drawImage(originalImage, 0, 0);

        // 헤어스타일 이미지 그리기 (원본 사진에 맞게 크기 조절)
        const scaleFactor = originalImage.width / 100; // 헤어스타일 이미지의 너비가 100px인 경우
        const newWidth = hairstyleImage.width * scaleFactor;
        const newHeight = hairstyleImage.height * scaleFactor;

        // 헤어스타일을 사진의 위쪽 중앙에 배치
        const x = (originalImage.width - newWidth) / 2;
        const y = 0; // 사진의 상단에 배치

        ctx.drawImage(hairstyleImage, x, y, newWidth, newHeight);

        // 합성된 이미지 URL 저장
        const resultImageUrl = canvas.toDataURL('image/png');
        localStorage.setItem('resultPhoto', resultImageUrl);
        navigate('/result');
      };
    };
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedHairStyle(null);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <h1>헤어스타일 선택</h1>
      <div className="hairstyle-list">
        {hairStyles.map((hairStyle) => (
          <div
            key={hairStyle.id}
            className="hairstyle-item"
            onClick={() => handleSelectClick(hairStyle)}
          >
            <img src={hairStyle.imageUrl} alt={hairStyle.name} />
            <span>{hairStyle.name}</span>
          </div>
        ))}
      </div>
      <button className="back-button" onClick={handleBack}>
        뒤로 가기
      </button>

      {/* 커스텀 모달 창 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        title="헤어스타일 선택 확인"
        message={`"${selectedHairStyle?.name}" 헤어스타일을 선택하시겠습니까?`}
      />
    </div>
  );
}

export default HairStyleList;
