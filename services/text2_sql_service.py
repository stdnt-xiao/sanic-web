import json
import logging
from common.date_util import DateEncoder
from constants.code_enum import SysCodeEnum as SysCode
from common.exception import MyException
from common.mysql_util import MysqlUtil

logger = logging.getLogger(__name__***REMOVED***


async def exe_sql_query(question_str, model_out_str***REMOVED***:
    """
    执行大模型解析出的sql语句并返回结果集
    Args:
        model_out_text 大模型输出信息
    Return:
    """

    if model_out_str:
        exception_str = ""
        model_out_json = ""
        try:
            model_out_json = json.loads(model_out_str***REMOVED***
            if not isinstance(model_out_json, dict***REMOVED***:
                model_out_json = json.loads(model_out_json***REMOVED***
            sql = model_out_json["sql"]
            if sql:
                result = MysqlUtil(***REMOVED***.query_ex(sql***REMOVED***
                # 这里不从数据库查 配置文件定义 避免三方不开权限问题
                table_schema_dict = MysqlUtil(***REMOVED***.get_multiple_tables_column_comments(["view_alarm_detail"]***REMOVED***
                table_schema_dict["llm"] = model_out_json
                table_schema_dict["data"] = result
                return json.dumps(table_schema_dict, ensure_ascii=False, cls=DateEncoder***REMOVED***
            else:
                logger.error("数据应答大模型返回SQL语句为空"***REMOVED***
                raise MyException(SysCode.c_9999***REMOVED***
        except Exception as e:
            exception_str = e.args[0]
            logger.error(f"数据应答处理失败: {model_out_str***REMOVED*** {e***REMOVED***"***REMOVED***
            raise MyException(SysCode.c_9999***REMOVED***
        finally:
            await add_question_record(question_str, model_out_json, exception_str***REMOVED***
    else:
        logger.error("数据应答大模型返回结果为空"***REMOVED***
        raise MyException(SysCode.c_9999***REMOVED***


async def add_question_record(question, model_out_json, exception_str***REMOVED***:
    """
    记录数据问答 日志
    """
    pass
    # try:
    #     insert_params = [question, str(model_out_json***REMOVED***, exception_str]
    #     sql = f" insert into t_database_qa_record(question,thoughts,error_msg***REMOVED*** values (%s,%s,%s***REMOVED***"
    #     # logging.info(f"police_database_qa_record.创建数据 sql= {sql***REMOVED*** value={insert_params***REMOVED***"***REMOVED***
    #     result = MysqlUtil(***REMOVED***.insert(sql=sql, params=insert_params***REMOVED***
    #     logging.info(result***REMOVED***
    # except Exception as e:
    #     logger.error(f"数据问答保存日志失败: {e***REMOVED***"***REMOVED***
