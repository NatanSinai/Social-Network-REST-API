import { generatePostContent, generatePostImage } from '@/api/post';
import { imageSchema } from '@/utils/zod';
import { postSchema } from '@entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, CircularProgress, Stack, TextField } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useEffect, type FC, type RefObject } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type z from 'zod';
import { ImageUpload } from '../generic';

export const postFormSchema = postSchema.pick({ title: true, content: true }).extend({ image: imageSchema.nullable() });

export type PostFormValues = z.infer<typeof postFormSchema>;

export type PostFormProps = {
  defaultValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => void | Promise<void>;
  submitLabel?: string;
  isDirtyFormRef: RefObject<boolean>;
};

export const PostForm: FC<PostFormProps> = ({ defaultValues, onSubmit, submitLabel = 'Submit', isDirtyFormRef }) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting, isValid, submitCount },
    setValue,
    watch,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: 'Morning Coffee in the Redwoods',
      content:
        'A steaming ceramic mug of coffee sitting on a mossy wooden log, giant redwood trees in the background with sunbeams filtering through the mist, soft bokeh, peaceful atmosphere',
      image: undefined,
      ...defaultValues,
    },
    mode: 'onTouched',
  });

  const formValues = watch();

  const isSubmitDisabled = (submitCount > 0 && !isValid) || isSubmitting;

  useEffect(() => {
    if (isDirty && !isDirtyFormRef.current) isDirtyFormRef.current = true;
  }, [isDirty, isDirtyFormRef]);

  // TODO: Add characters counter

  const generateImageMutation = useMutation({
    mutationFn: generatePostImage,
    onSuccess: (data) => setValue('image', data.imageURL, { shouldDirty: true, shouldValidate: true }),
    onError: (error) => alert('Failed to generate image: ' + error.message),
  });

  const generateContentMutation = useMutation({
    mutationFn: generatePostContent,
    onSuccess: (data) => setValue('content', data.content, { shouldDirty: true, shouldValidate: true }),
    onError: (error) => alert('Failed to generate content: ' + error.message),
  });

  const handleGenerateAIImage = () =>
    generateImageMutation.mutate({ title: formValues.title, content: formValues.content });

  const handleGenerateAIContent = () =>
    generateContentMutation.mutate({ title: formValues.title, image: formValues.image });

  const isAITaskLoading = generateImageMutation.isPending || generateContentMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1} justifyContent='center' alignItems='center'>
        <Stack direction='row' p={1} gap={2} width='100%'>
          <Stack spacing={1}>
            <Controller
              name='image'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <ImageUpload {...field} disabled={field.disabled ?? isSubmitting} error={error?.message} />
              )}
            />

            <Button
              variant='outlined'
              onClick={handleGenerateAIImage}
              disabled={isAITaskLoading || !formValues.title}
              sx={{ gap: 1 }}
            >
              {generateImageMutation.isPending ? <CircularProgress size={20} color='secondary' /> : '🎨'} Generate AI
              Image
            </Button>
          </Stack>

          <Stack spacing={4} width='100%'>
            <Controller
              name='title'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  label='Title'
                  {...field}
                  error={!!error}
                  helperText={error?.message}
                  disabled={isSubmitting}
                  fullWidth
                  autoFocus
                />
              )}
            />

            <Stack spacing={2}>
              <Controller
                name='content'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label='Content'
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    disabled={isSubmitting}
                    multiline
                    minRows={3}
                    maxRows={4}
                    fullWidth
                  />
                )}
              />

              <Stack justifyContent='center'>
                <Button
                  variant='outlined'
                  sx={{ borderRadius: 4, gap: 1 }}
                  onClick={handleGenerateAIContent}
                  disabled={isAITaskLoading || !formValues.image}
                >
                  {generateContentMutation.isPending ? <CircularProgress size={20} color='secondary' /> : '✨'} Generate
                  AI Image Generate AI Content
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>

        <Button type='submit' variant='contained' disabled={isSubmitDisabled}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
};
