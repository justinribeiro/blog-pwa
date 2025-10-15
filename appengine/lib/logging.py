__author__ = "Justin Ribeiro <justin@justinribeiro.com>"

import logging
import json
import sys
from datetime import datetime


class JsonFormatter(logging.Formatter):
    """Formats logs as structured JSON for Cloud Logging and GCP; sad, necessary
    evil these days"""

    def format(self, record):
        # don't remember where I pulled this from, somewhere in the docs
        log = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "severity": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
            "pathname": record.pathname,
            "lineno": record.lineno,
        }

        if record.exc_info:
            log["exception"] = self.formatException(record.exc_info)

        return json.dumps(log)


def setup_json_logging(level=logging.INFO):
    """Configure root logger for JSON output."""
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())

    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    root_logger.handlers = [handler]

    # Suppress overly chatty libraries if needed
    logging.getLogger("jinja2").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
