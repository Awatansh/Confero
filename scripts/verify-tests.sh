#!/usr/bin/env bash

# Test Setup Verification Script
# This script verifies that all test infrastructure is properly configured

set -e

echo "🔍 Confero Test Setup Verification"
echo "=================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2 (not found: $1)"
        FAILURES=$((FAILURES + 1))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2 (not found: $1)"
        FAILURES=$((FAILURES + 1))
    fi
}

# Function to check if npm package is installed
check_package() {
    if npm list "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 installed"
    else
        echo -e "${RED}✗${NC} $1 not installed"
        FAILURES=$((FAILURES + 1))
    fi
}

echo "📁 Checking test files..."
check_file "tests/content-validation.test.js" "Content validation tests"
check_file "tests/page-generation.test.js" "Page generation tests"
check_file "tests/space-system.test.js" "Space system tests"
check_file "tests/tag-system.test.js" "Tag system tests"
check_file "tests/rss-sitemap.test.js" "RSS & sitemap tests"
check_file "tests/ui-components.test.js" "UI component tests"
check_file "tests/assets-links.test.js" "Assets & links tests"
echo ""

echo "📁 Checking configuration files..."
check_file "vitest.config.js" "Vitest configuration"
check_file ".prettierrc" "Prettier configuration"
check_file ".prettierignore" "Prettier ignore file"
check_file ".github/workflows/tests.yml" "GitHub Actions workflow"
echo ""

echo "📁 Checking documentation..."
check_file "docs/TESTING.md" "Testing guide"
check_file "docs/BRANCH_PROTECTION.md" "Branch protection guide"
check_file "docs/TEST_QUICK_REFERENCE.md" "Quick reference"
check_file "docs/TESTING_EXAMPLES.md" "Testing examples"
echo ""

echo "📦 Checking npm packages..."
check_package "vitest"
check_package "@vitest/ui"
check_package "@vitest/coverage-v8"
check_package "prettier"
check_package "prettier-plugin-astro"
echo ""

echo "📝 Checking package.json scripts..."
if grep -q '"test":' package.json; then
    echo -e "${GREEN}✓${NC} npm test script"
else
    echo -e "${RED}✗${NC} npm test script"
    FAILURES=$((FAILURES + 1))
fi

if grep -q '"lint":' package.json; then
    echo -e "${GREEN}✓${NC} npm run lint script"
else
    echo -e "${RED}✗${NC} npm run lint script"
    FAILURES=$((FAILURES + 1))
fi

if grep -q '"format":' package.json; then
    echo -e "${GREEN}✓${NC} npm run format script"
else
    echo -e "${RED}✗${NC} npm run format script"
    FAILURES=$((FAILURES + 1))
fi

if grep -q '"check":' package.json; then
    echo -e "${GREEN}✓${NC} npm run check script"
else
    echo -e "${RED}✗${NC} npm run check script"
    FAILURES=$((FAILURES + 1))
fi
echo ""

echo "📊 Summary"
echo "=========="
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "You can now:"
    echo "  • Run tests: npm test"
    echo "  • Format code: npm run format"
    echo "  • Check types: npm run check"
    echo "  • Build project: npm run build"
    echo ""
    echo "Next steps:"
    echo "  1. Push to GitHub to trigger CI/CD"
    echo "  2. Configure branch protection rules"
    echo "  3. Review docs/BRANCH_PROTECTION.md"
    exit 0
else
    echo -e "${RED}✗ $FAILURES check(s) failed${NC}"
    echo ""
    echo "Please fix the issues above and run this script again."
    exit 1
fi
