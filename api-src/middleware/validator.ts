import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute todas as validações
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: any[] = [];
    errors.array().map(err => extractedErrors.push({ 
      field: 'param' in err ? err.param : 'unknown',
      message: err.msg 
    }));

    res.status(422).json({
      success: false,
      message: 'Erro de validação',
      errors: extractedErrors,
    });
  };
};
