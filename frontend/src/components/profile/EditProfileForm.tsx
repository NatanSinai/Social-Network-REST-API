import { imageSchema } from '@/utils/zod';
import { userSchema } from '@entities';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DialogActions, DialogContent, Stack, TextField } from '@mui/material';
import { type FC } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type z from 'zod';
import { ImageUpload } from '../generic';

export const userFormSchema = userSchema.pick({ username: true }).extend({ image: imageSchema });

export type UserFormValues = z.infer<typeof userFormSchema>;

export type EditProfileFormProps = {
  defaultValues?: Partial<UserFormValues> & { image?: string };
  onSubmit: (values: UserFormValues) => void | Promise<void>;
  onClose: () => void;
};

const EditProfileForm: FC<EditProfileFormProps> = ({ defaultValues, onSubmit, onClose }) => {
  const { handleSubmit, control } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
    mode: 'onTouched',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Stack spacing={4} sx={{ mt: 2 }}>
          <Controller
            name='image'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <ImageUpload {...field} disabled={field.disabled} error={error?.message} />
            )}
          />

          <Controller
            name='username'
            control={control}
            rules={{ required: 'Username is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                fullWidth
                label='Username'
                variant='outlined'
                placeholder='Enter username'
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color='inherit' sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          type='submit'
          variant='contained'
          disableElevation
          sx={{ textTransform: 'none', px: 4, borderRadius: '8px' }}
        >
          Save
        </Button>
      </DialogActions>
    </form>
  );
};

export default EditProfileForm;
