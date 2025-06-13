import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const SlideContainer = styled.div`
  width: 100%;
  max-width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background-color: black;
`;

const SlideTrack = styled.div<{ currentSlide: number }>`
  display: flex;
  width: 100%;
  height: 100%;
  transform: translateX(${(props) => `-${props.currentSlide * 100}%`});
  transition: transform 0.6s ease-in-out;
`;

const Slide = styled.div`
  min-width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface ImageProps {
  isSmall?: boolean;
}

const Image = styled.img.attrs<ImageProps>((props) => ({
  isSmall: undefined,
}))<ImageProps>`
  width: ${(props) => (props.isSmall ? "auto" : "100%")};
  height: ${(props) => (props.isSmall ? "auto" : "100%")};
  object-fit: ${(props) => (props.isSmall ? "contain" : "cover")};
`;
const SliderButton = styled.button`
  position: absolute;
  background-color: rgba(48, 5, 50, 0.5);
  border: none;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  color: white;
  top: calc(50% - 27px);
  z-index: 999;
  cursor: pointer;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: rgba(100, 20, 100, 0.7);
    transform: scale(1.1);
  }
`;

interface SlideShowProps {
  images: string[];
}

const SlideShow: React.FC<SlideShowProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSmallImage, setIsSmallImage] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.src = images[currentSlide];
    img.onload = () => {
      setIsSmallImage(img.naturalWidth < 700 || img.naturalHeight < 400);
    };
  }, [currentSlide, images]);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + images.length) % images.length
    );
  };

  return (
    <SlideContainer>
      {images.length > 1 && (
        <SliderButton style={{ left: "10px" }} onClick={prevSlide}>
          <ArrowBackIcon />
        </SliderButton>
      )}
      <SlideTrack currentSlide={currentSlide}>
        {images.map((image, index) => (
          <Slide key={index}>
            <Image
              src={image}
              alt={`slide-${index + 1}`}
              isSmall={isSmallImage}
            />
          </Slide>
        ))}
      </SlideTrack>
      {images.length > 1 && (
        <SliderButton style={{ right: "10px" }} onClick={nextSlide}>
          <ArrowForwardIcon />
        </SliderButton>
      )}
    </SlideContainer>
  );
};

export default SlideShow;
