
abstract class BaseController {
  protected json(data: unknown, status = 200) {
    return {data, status}
  }
}

export {BaseController}
