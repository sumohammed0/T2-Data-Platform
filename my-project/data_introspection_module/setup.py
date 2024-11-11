from setuptools import setup, find_packages

setup(
    name="data-introspection",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "pandas>=1.5.0",
        "psycopg2-binary>=2.9.0",
    ],
    python_requires=">=3.7",
    author="Your Name",
    author_email="your.email@example.com",
    description="A data introspection module for CSV, SQLite, and PostgreSQL sources",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/yourusername/data-introspection",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
    ],
)