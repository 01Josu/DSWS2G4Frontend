import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');

  if (token) {
    console.log('Interceptor: Añadiendo token a la solicitud');

    // Clonamos la solicitud con el token en el header
    const authReq = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
    return next(authReq);
  }

  // Si no hay token, continuar con la solicitud original
  return next(req);
};
