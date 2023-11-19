import React, { useState } from "react";
import './App.css';

const ComicCreator = () => {
  const [texts, setTexts] = useState(Array(10).fill(""));
  const [images, setImages] = useState([]);

  const handleTextChange = (e, index) => {
    const newValues = [...texts];
    newValues[index] = e.target.value;
    setTexts(newValues);
  };

  const queryHuggingFace = async (text) => {
    try {
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          method: "POST",
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const imageData = await response.blob();
      return URL.createObjectURL(imageData);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imagePromises = texts.map(async (text) => {
        const imageUrl = await queryHuggingFace(text);
        return imageUrl;
      });

      const imageUrls = await Promise.all(imagePromises);
      setImages(imageUrls);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
  <h1 style={{ display: 'inline-block' }}>Welcome to Comic Generator!</h1>
</div>
    
      <p style={{ fontStyle: 'italic', color: 'red', textAlign: 'center', backgroundColor: '#000'}}>
  Wanna take your storytelling and comic writing skills to the next level? We here at Dashtoon are here to help! Simply enter the prompt on which you want a comic panel, and we will provide you with the same!
</p>
<p style={{ fontStyle: 'italic', color: 'red', textAlign: 'center', backgroundColor: '#000'}}>PS: Try not to leave any panels empty! AI is scary :o</p>

      <form onSubmit={handleSubmit}>
        {texts.map((text, index) => (
          <input
            key={index}
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e, index)}
            placeholder={`Panel ${index + 1}`}
          />
        ))}
        <button type="submit">Generate Comics</button>
      </form>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {images.map((imageUrl, index) => (
          <div
            key={index}
            style={{
              width: "200px",
              height: "200px",
              margin: "10px",
              border: "1px solid #ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={imageUrl}
              alt={`Comic ${index}`}
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComicCreator;