import { imageSchema } from '@/utils/zod';
import { postSchema } from '@entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField } from '@mui/material';
import { useEffect, type FC, type RefObject } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type z from 'zod';
import { ImageUpload } from '../generic';

export const postFormSchema = postSchema.pick({ title: true, content: true }).extend({ image: imageSchema.nullable() });

export type PostFormValues = z.infer<typeof postFormSchema>;

export type PostFormProps = {
  defaultValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => void;
  submitLabel?: string;
  isDirtyFormRef: RefObject<boolean>;
};

export const PostForm: FC<PostFormProps> = ({ defaultValues, onSubmit, submitLabel = 'Submit', isDirtyFormRef }) => {
  const {
    handleSubmit,
    control,
    formState: { isDirty, isSubmitting, isValid, submitCount },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { title: '', content: '', image: undefined, ...defaultValues },
    mode: 'onTouched',
  });

  const isSubmitDisabled = (submitCount > 0 && !isValid) || isSubmitting;

  useEffect(() => {
    if (isDirty && !isDirtyFormRef.current) isDirtyFormRef.current = true;
  }, [isDirty, isDirtyFormRef]);

  // TODO: Add characters counter

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1} justifyContent='center' alignItems='center'>
        <Stack direction='row' p={1} gap={2} width='100%'>
          <Controller
            name='image'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ImageUpload {...field} disabled={field.disabled ?? isSubmitting} error={error?.message} />
            )}
          />

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
          </Stack>
        </Stack>

        <Button type='submit' variant='contained' disabled={isSubmitDisabled}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
};
