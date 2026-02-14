import { Delete, Image, Upload } from '@mui/icons-material';
import { Box, IconButton, Stack, Typography, type IconButtonProps } from '@mui/material';
import { useRef, type FC } from 'react';
import { useImageDragAndDrop, useImagePaste, useImagePreview } from './hooks';

export type FileOrURL = File | string | null;

export type ImageUploadProps = { value: FileOrURL; onChange: (value: FileOrURL) => void; size?: number };

export const ImageUpload: FC<ImageUploadProps> = ({ value, onChange, size = 200 }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { previewUrl } = useImagePreview({ value });

  const { isDragging, handleDragOver, handleDragLeave, handleDrop, handleDragEnter } = useImageDragAndDrop({
    onImageDrop: onChange,
  });

  useImagePaste({ onImagePaste: onChange });

  const handleDeleteFile: IconButtonProps['onClick'] = (event) => {
    event.stopPropagation();

    onChange(null);
  };

  return (
    <Stack spacing={2} alignItems='flex-start'>
      <Box
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        sx={{
          width: size,
          height: size,
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: isDragging ? 'primary.main' : 'divider',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isDragging ? 'action.hover' : 'transparent',
          transition: 'all 0.2s ease',
        }}
      >
        {previewUrl ? (
          <Box
            component='img'
            src={previewUrl}
            alt='Preview'
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Image color='disabled' fontSize='large' sx={{ pointerEvents: 'none' }} />
        )}

        {isDragging && (
          <Stack
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0, 0, 0, 0.35)',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography color='white' variant='subtitle1'>
              Drop image here
            </Typography>
          </Stack>
        )}

        {previewUrl && (
          <Stack
            direction='row'
            spacing={2}
            sx={{
              position: 'absolute',
              inset: 0,
              bgcolor: 'rgba(0, 0, 0, 0.45)',
              opacity: 0,
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 1 },
            }}
          >
            <IconButton color='primary' onClick={() => fileInputRef.current?.click()}>
              <Upload />
            </IconButton>

            <IconButton color='error' onClick={handleDeleteFile}>
              <Delete />
            </IconButton>
          </Stack>
        )}

        <input
          ref={fileInputRef}
          hidden
          type='file'
          accept='image/*'
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </Box>
    </Stack>
  );
};
