import { Box } from '@/components/Box';
import { Input, Label } from '@/components/Form';
import { Stack } from '@/components/Layouts';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { PlayCircle, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styled from 'styled-components';
import { UploadImageIcon } from '../UploadImageIcon';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: transparent;
  max-width: 800px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: 20px;
  width: 100%;
  margin: 0 auto;
`;

const UploadWrapper = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #000;
  border-radius: 8px;
  width: 100%;
  height: 200px;
  margin: 0 auto;
  cursor: pointer;
  transition: border-color 0.3s;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    cursor: pointer;
  }
`;
interface FilePreview {
  id: string;
  file: File;
  src: string;
  isVideo: boolean;
}
const UploadComponent = ({
  handleFile,
  getValues,
}: {
  handleFile: any;
  getValues: any;
}) => {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (getValues('storyURLs')) {
      const newFilePreviews = getValues('storyURLs').map((url: string) => ({
        src: url,
        isVideo: url.split('.').pop() === 'mp4' ? true : false,
        id: url,
      }));

      setFilePreviews(newFilePreviews);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelectedVideo(null);
      }
    };
    if (selectedVideo) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedVideo]);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const openVideo = (src: string) => {
    setSelectedVideo(src);
  };
  const removeFile = (id: string, index: number) => {
    if (getValues('storyURLs')) {
      getValues('storyURLs').splice(index, 1);
    }

    setFilePreviews(filePreviews.filter((preview) => preview.id !== id));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const maxFileSize = 5 * 1024 * 1024;
    if (files) {
      const validFiles: File[] = [];
      const errors: string[] = [];

      // Validate files
      Array.from(files).forEach((file) => {
        if (file.size > maxFileSize) {
          errors.push(`File too large: ${file.name} (Max: 5MB)`);
        } else {
          validFiles.push(file);
        }
      });
      if (validFiles.length > 0) {
        handleFile(validFiles);
        const newFilePreviews = Array.from(validFiles).map((file) => ({
          id: file.name,
          file,
          src: URL.createObjectURL(file),
          isVideo: file.type.startsWith('video/'),
        }));
        setFilePreviews((prevPreviews) => [
          ...prevPreviews,
          ...newFilePreviews,
        ]);
      }
    }
  };

  return (
    <>
      {filePreviews.length > 0 ? (
        <>
          <Box>
            <Stack direction="horizontal">
              <GridWrapper>
                {filePreviews.map((preview: FilePreview, index: number) => (
                  <div
                    key={preview.id}
                    className="rounded relative w-[128px] h-[128px]"
                  >
                    {preview.isVideo ? (
                      <>
                        <video
                          src={preview.src}
                          className="object-cover w-full h-full"
                          muted
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer"
                          onClick={() => openVideo(preview.src)}
                        >
                          <PlayCircle className="text-white text-3xl" />
                        </div>
                      </>
                    ) : (
                      <Image
                        src={preview.src}
                        alt="Preview"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        layout="responsive"
                        className="object-cover w-full h-full"
                        key={preview.src}
                      />
                    )}
                    <Button
                      className="absolute top-1 right-1 bg-red-500 text-white hover:bg-red-600"
                      onClick={() => removeFile(preview.id, index)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                ))}
                <Box
                  as={'label'}
                  htmlFor="file"
                  className="w-32 h-32 border-dashed border-black-100 rounded flex items-center justify-center cursor-pointer"
                >
                  <Label className="flex flex-col items-center justify-center cursor-pointer">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={(e: any) => handleFileChange(e)}
                      id="file"
                    />
                    <Box className="flex justify-center">
                      <UploadImageIcon />
                    </Box>

                    <span className="text-gray-400 cursor-pointer">
                      Add images/videos
                    </span>
                  </Label>
                </Box>
              </GridWrapper>
            </Stack>
            {selectedVideo && (
              <Box>
                <ModalOverlay>
                  <ModalContent>
                    <Box className="relative w-3/4 h-3/4" ref={modalRef}>
                      <video
                        ref={videoRef}
                        src={selectedVideo}
                        className="object-cover w-full h-full"
                        muted
                        controls
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                      {!isPlaying && (
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer"
                          onClick={handlePlay}
                        >
                          <PlayCircle className="text-white text-3xl" />
                        </div>
                      )}
                    </Box>
                  </ModalContent>
                </ModalOverlay>
              </Box>
            )}
          </Box>
        </>
      ) : (
        <UploadWrapper htmlFor="file">
          <Box
            padding={2}
            cssProps={{
              backgroundColor: '#F3F3F3',
              borderRadius: 100,
              cursor: 'pointer',
            }}
          >
            <UploadImageIcon />
          </Box>
          <Label htmlFor="file">Add Images/Videos*</Label>
          <Label htmlFor="file">A minimum of 1 image/Video</Label>
          <Input
            id="file"
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={(e: any) => handleFileChange(e)}
          />
        </UploadWrapper>
      )}
    </>
  );
};

export default UploadComponent;
