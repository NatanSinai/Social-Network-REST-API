import { postFormSchema, type PostFormValues } from '@entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, TextField } from '@mui/material';
import { useEffect, type FC, type RefObject } from 'react';
import { useForm } from 'react-hook-form';

export type PostFormProps = {
  defaultValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  isDirtyFormRef: RefObject<boolean>;
};

export const PostForm: FC<PostFormProps> = ({
  defaultValues,
  onSubmit,
  submitLabel = 'Submit',
  isSubmitting = false,
  isDirtyFormRef,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PostFormValues>({ resolver: zodResolver(postFormSchema), defaultValues, mode: 'onTouched' });

  useEffect(() => {
    if (isDirty && !isDirtyFormRef.current) isDirtyFormRef.current = true;
  }, [isDirty, isDirtyFormRef]);

  // TODO: Add characters counter

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1} justifyContent='center' alignItems='center'>
        <Stack spacing={4} width='100%' p={1} py={2}>
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
            minRows={2}
            maxRows={4}
            fullWidth
          />

          <TextField
            label='Image URL'
            {...register('imageURL')}
            error={!!errors.imageURL}
            helperText={errors.imageURL?.message}
            fullWidth
          />
        </Stack>

        <Button type='submit' variant='contained' disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  );
};
