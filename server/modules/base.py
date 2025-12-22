from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseModule(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        pass

    @abstractmethod
    async def execute(self, target: str) -> List[Dict[str, Any]]:
        """
        Executes the module against a target (domain, IP, email).
        Returns a list of standardized 'Entity' dictionaries.
        """
        pass

    def create_entity(self, type: str, value: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        return {
            "module": self.name,
            "type": type,
            "value": value,
            "metadata": metadata or {}
        }
