from constants.code_enum import SysCodeEnum


class MyException(Exception***REMOVED***:
    """
    自定义异常
    """

    def __init__(self, ex_code: SysCodeEnum***REMOVED***:
        super(***REMOVED***.__init__(f"{ex_code.name***REMOVED***({ex_code.value[0]***REMOVED******REMOVED***"***REMOVED***

        self.code, self.message, self.detail = (
            ex_code.value[0],
            ex_code.value[1],
            ex_code.value[2],
        ***REMOVED***

    def __str__(self***REMOVED***:
        return f"MyException: " f"code: {self.code***REMOVED***, " f"message: {self.message***REMOVED*** - " f"detail: {self.detail***REMOVED***"

    def to_dict(self***REMOVED***:
        """

        :return:
        """
    ***REMOVED***"code": self.code, "message": self.message***REMOVED***
