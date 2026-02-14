import { imageSchema } from '@/utils/zod';
import { postSchema } from '@entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormHelperText, Stack, TextField } from '@mui/material';
import { useEffect, type FC, type RefObject } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type z from 'zod';
import { ImageUpload } from '../generic';

export const postFormSchema = postSchema.pick({ title: true, content: true }).extend({ image: imageSchema });

export type PostFormValues = z.infer<typeof postFormSchema>;

export type PostFormProps = {
  defaultValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => void;
  submitLabel?: string;
  isDirtyFormRef: RefObject<boolean>;
};

export const PostForm: FC<PostFormProps> = ({ defaultValues, onSubmit, submitLabel = 'Submit', isDirtyFormRef }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: { title: '', content: '', ...defaultValues },
    mode: 'onTouched',
  });

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
              <>
                <ImageUpload {...field} />

                {!!error && <FormHelperText error>{error.message}</FormHelperText>}
              </>
            )}
          />

          <Stack spacing={4} width='100%'>
            <TextField
              label='Title'
              {...register('title')}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
            />

            <TextField
              label='Content'
              {...register('content')}
              error={!!errors.content}
              helperText={errors.content?.message}
              multiline
              minRows={3}
              maxRows={4}
              fullWidth
            />
          </Stack>
        </Stack>

        <Button type='submit' variant='contained' disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
};
