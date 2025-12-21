import Swal from "sweetalert2";

export const swalToast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true,
});

export const swalSuccess = (title = "Success") =>
  swalToast.fire({ icon: "success", title });

export const swalError = (title = "Something went wrong") =>
  swalToast.fire({ icon: "error", title });

export const swalInfo = (title = "Info") =>
  swalToast.fire({ icon: "info", title });

export const swalConfirm = async ({
  title = "Are you sure?",
  text = "",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
} = {}) => {
  const res = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });
  return res.isConfirmed;
};
