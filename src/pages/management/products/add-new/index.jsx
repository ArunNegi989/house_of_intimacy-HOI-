import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Switch,
  Tag,
  Heading,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  Divider,
  Text,
  useColorModeValue,
  Badge,
  Image,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

const predefinedColors = [
  "Black",
  "Nude",
  "Red",
  "White",
  "Pink",
  "Blue",
  "Green",
  "Purple",
];

const AddProducts = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const [sizes, setSizes] = useState([
    { label: "XS", stock: 0, selected: false },
    { label: "S", stock: 0, selected: false },
    { label: "M", stock: 0, selected: false },
    { label: "L", stock: 0, selected: false },
    { label: "XL", stock: 0, selected: false },
    { label: "XXL", stock: 0, selected: false },
    { label: "3XL", stock: 0, selected: false },
  ]);

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedColors, setSelectedColors] = useState([]);

  const cardBg = useColorModeValue("white", "gray.900");
  const pageBg = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Auto price calculation
  const mrp = Number(watch("mrp") || 0);
  const discount = Number(watch("discount") || 0);
  const salePrice = Math.max(
    0,
    Math.round(mrp - (mrp * discount) / 100) || 0
  );

  // Live preview data
  const nameWatch = watch("name") || "Product name";
  const brandWatch = watch("brand") || "Brand";
  const categoryWatch = watch("category") || "Category";
  const colorsWatch = watch("colors") || selectedColors.join(", ");
  const tagsWatch = watch("tags") || "";
  const isFeaturedWatch = watch("isFeatured") || false;

  const colorsRegister = register("colors");
  const mainImageRegister = register("mainImage");

  // Submit Handler
  const onSubmit = (data) => {
    const selectedSizes = sizes
      .filter((s) => s.selected)
      .map((s) => ({ label: s.label, stock: Number(s.stock || 0) }));

    const tagsArray = data.tags
      ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    // prefer data.colors string; fallback to selectedColors
    const colorsSource =
      data.colors && data.colors.trim().length > 0
        ? data.colors
        : selectedColors.join(",");
    const colorsArray = colorsSource
      ? colorsSource.split(",").map((c) => c.trim()).filter(Boolean)
      : [];

    const keywordsArray = data.seoKeywords
      ? data.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : [];

    const {
      metaTitle,
      metaDescription,
      seoKeywords,
      seoSchema,
      ...restFields
    } = data;

    const finalData = {
      ...restFields,
      price: {
        mrp,
        discountPercent: discount,
        sale: salePrice,
      },
      sizes: selectedSizes,
      tags: tagsArray,
      colors: colorsArray,
      seo: {
        metaTitle: metaTitle || "",
        metaDescription: metaDescription || "",
        keywords: keywordsArray,
        schemaMarkup: seoSchema || "",
      },
    };

    console.log("Final Product Payload:", finalData);
    alert("Product data ready! Console me payload check karo.");
  };

  return (
    <Box bg={pageBg} pt={{ base: "95px", md: "85px" }} minH="100vh">
      <Box maxW="1200px" mx="auto">
        {/* Page Header */}
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={2}
          mb={6}
        >
          <Box>
            <Heading size="lg" mb={1}>
              Add New Product
            </Heading>
            <Text fontSize="sm" color="gray.500">
              Fill all important details so that user ko clear information mile.
            </Text>
          </Box>

          <Badge
            colorScheme="purple"
            borderRadius="full"
            px={3}
            py={1}
            fontSize="xs"
          >
            HOI • Innerwear / Swimwear
          </Badge>
        </Flex>

        <Flex gap={6} direction={{ base: "column", lg: "row" }}>
          {/* LEFT: MAIN FORM */}
          <Box
            flex="3"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            p={{ base: 4, md: 6 }}
            boxShadow="sm"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* SECTION: BASIC INFO */}
              <Heading size="md" mb={3}>
                Basic Information
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Product ka naam, category, brand etc.
              </Text>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl isRequired isInvalid={errors.name}>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    placeholder="Jockey Cotton Bikini Brief"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <Text fontSize="xs" color="red.400" mt={1}>
                      {errors.name.message}
                    </Text>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel>Slug (URL)</FormLabel>
                  <Input
                    placeholder="jockey-cotton-bikini-brief-black"
                    {...register("slug")}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Brand</FormLabel>
                  <Select {...register("brand")} placeholder="Select brand">
                    <option value="Jockey">Jockey</option>
                    <option value="Nike">Nike</option>
                    <option value="Puma">Puma</option>
                    <option value="Clovia">Clovia</option>
                    <option value="Zivame">Zivame</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Gender / Target</FormLabel>
                  <Select {...register("gender")} placeholder="Select target">
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="unisex">Unisex</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Category</FormLabel>
                  <Select
                    {...register("category")}
                    placeholder="Select category"
                  >
                    <option>Bra</option>
                    <option>Panty</option>
                    <option>Brief</option>
                    <option>Boxer</option>
                    <option>Nightwear</option>
                    <option>Swimwear</option>
                    <option>Shapewear</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Sub Category / Style</FormLabel>
                  <Input
                    {...register("subcategory")}
                    placeholder="Example: T-shirt Bra, Bikini, Bralette, Hipster"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>SKU</FormLabel>
                  <Input
                    {...register("sku")}
                    placeholder="JKY-BRA-123-RED-34B"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>HSN / Tax Slab</FormLabel>
                  <Input
                    {...register("taxSlab")}
                    placeholder="Example: 12% GST / HSN code"
                  />
                </FormControl>
              </SimpleGrid>

              <Divider my={6} />

              {/* SECTION: IMAGES */}
              <Heading size="md" mb={3}>
                Images
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Main image product thumbnail ke liye use hogi, gallery detail
                page ke liye.
              </Text>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl isRequired>
                  <FormLabel>Main Image</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    {...mainImageRegister}
                    onChange={(e) => {
                      // react-hook-form ka onChange bhi call karna hai
                      mainImageRegister.onChange(e);
                      const file = e.target.files?.[0];
                      if (file) {
                        setImagePreview(URL.createObjectURL(file));
                      } else {
                        setImagePreview(null);
                      }
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Gallery Images (multiple)</FormLabel>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    {...register("galleryImages")}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Size Guide Image / URL</FormLabel>
                  <Input
                    {...register("sizeGuideUrl")}
                    placeholder="https://example.com/size-guide-image"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Video URL (optional)</FormLabel>
                  <Input
                    {...register("videoUrl")}
                    placeholder="https://youtube.com/..."
                  />
                </FormControl>
              </SimpleGrid>

              <Divider my={6} />

              {/* SECTION: COLORS & SIZES */}
              <Heading size="md" mb={3}>
                Colors & Sizes
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Multiple colors & per-size stock set kar sakte ho.
              </Text>

              {/* COLOR TABS / CHIPS */}
              <FormControl mb={4}>
                <FormLabel>Colors</FormLabel>
                <Text fontSize="xs" color="gray.500" mb={2}>
                  Click to select available colors. Ye values baad me filter ke liye use hongi.
                </Text>

                <Flex wrap="wrap" gap={2} mb={3}>
                  {predefinedColors.map((color) => {
                    const isActive = selectedColors.includes(color);
                    return (
                      <Button
                        key={color}
                        size="xs"
                        variant={isActive ? "solid" : "outline"}
                        colorScheme={isActive ? "purple" : "gray"}
                        borderRadius="full"
                        onClick={() => {
                          let updated;
                          if (isActive) {
                            updated = selectedColors.filter((c) => c !== color);
                          } else {
                            updated = [...selectedColors, color];
                          }
                          setSelectedColors(updated);
                          setValue("colors", updated.join(", "));
                        }}
                      >
                        {color}
                      </Button>
                    );
                  })}
                </Flex>

                {/* Custom colors input – synced with RHF + state */}
                <Input
                  placeholder="Custom colors (comma separated) - e.g. Wine, Teal"
                  size="sm"
                  {...colorsRegister}
                  onChange={(e) => {
                    colorsRegister.onChange(e);
                    const value = e.target.value;
                    const parts = value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean);
                    setSelectedColors(parts);
                  }}
                />
              </FormControl>

              {/* Sizes with Stock */}
              <Box>
                <FormLabel fontWeight="600" mb={2}>
                  Available Sizes & Stock
                </FormLabel>

                <Flex gap={4} wrap="wrap">
                  {sizes.map((size, index) => (
                    <Box
                      key={size.label}
                      p={3}
                      border="1px solid"
                      borderColor={borderColor}
                      rounded="md"
                      minW="130px"
                    >
                      <Flex align="center" justify="space-between">
                        <Tag size="sm" variant="subtle" colorScheme="blue">
                          {size.label}
                        </Tag>
                        <Switch
                          size="sm"
                          isChecked={size.selected}
                          onChange={(e) => {
                            const updated = [...sizes];
                            updated[index].selected = e.target.checked;
                            setSizes(updated);
                          }}
                        />
                      </Flex>

                      {size.selected && (
                        <Input
                          mt={2}
                          size="sm"
                          placeholder="Stock"
                          type="number"
                          min={0}
                          onChange={(e) => {
                            const updated = [...sizes];
                            updated[index].stock = e.target.value;
                            setSizes(updated);
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Flex>
              </Box>

              <Divider my={6} />

              {/* SECTION: PRICING & INVENTORY */}
              <Heading size="md" mb={3}>
                Pricing & Inventory
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                MRP, discount set karo. Sale price auto calculate ho jayega.
              </Text>

              <SimpleGrid columns={[1, 3]} gap={4}>
                <FormControl>
                  <FormLabel>MRP (₹)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register("mrp")}
                      placeholder="999"
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Discount (%)</FormLabel>
                  <NumberInput min={0} max={90}>
                    <NumberInputField
                      {...register("discount")}
                      placeholder="20"
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Sale Price (₹)</FormLabel>
                  <Input value={salePrice} isReadOnly bg="gray.200" />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={[1, 2]} gap={4} mt={4}>
                <FormControl>
                  <FormLabel>Total Stock (optional)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      {...register("totalStock")}
                      placeholder="Auto from sizes or manual"
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select {...register("status")} defaultValue="active">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="out-of-stock">Out of Stock</option>
                    <option value="archived">Archived</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <FormControl mt={4} display="flex" alignItems="center" gap={3}>
                <FormLabel mb="0">Featured on Home Page</FormLabel>
                <Switch {...register("isFeatured")} />
              </FormControl>

              <Divider my={6} />

              {/* SECTION: ATTRIBUTES */}
              <Heading size="md" mb={3}>
                Fabric & Comfort Attributes
              </Heading>
              <Text fontSize="sm" color="gray.500" mb={4}>
                Innerwear ke liye yeh fields bahut helpful hoti hain filters ke
                liye.
              </Text>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl>
                  <FormLabel>Fabric</FormLabel>
                  <Select {...register("fabric")} placeholder="Select fabric">
                    <option>Cotton</option>
                    <option>Modal</option>
                    <option>Cotton Blend</option>
                    <option>Polyester</option>
                    <option>Nylon</option>
                    <option>Spandex</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Fabric Composition</FormLabel>
                  <Input
                    {...register("composition")}
                    placeholder="95% Cotton, 5% Elastane"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Coverage</FormLabel>
                  <Select
                    {...register("coverage")}
                    placeholder="Select coverage"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>Full</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Padding</FormLabel>
                  <Select
                    {...register("padding")}
                    placeholder="Select padding"
                  >
                    <option>Non-Padded</option>
                    <option>Lightly Padded</option>
                    <option>Heavily Padded</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Underwire</FormLabel>
                  <Select
                    {...register("underwire")}
                    placeholder="Wired / Non-wired"
                  >
                    <option>Wired</option>
                    <option>Non-wired</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Strap Type</FormLabel>
                  <Select
                    {...register("strapType")}
                    placeholder="Select strap type"
                  >
                    <option>Regular</option>
                    <option>Detachable</option>
                    <option>Multiway</option>
                    <option>Transparent</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Closure Type</FormLabel>
                  <Select
                    {...register("closureType")}
                    placeholder="Select closure"
                  >
                    <option>Back Closure</option>
                    <option>Front Closure</option>
                    <option>Slip-on</option>
                    <option>Hook &amp; Eye</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Pattern / Design</FormLabel>
                  <Select
                    {...register("pattern")}
                    placeholder="Select pattern"
                  >
                    <option>Solid</option>
                    <option>Printed</option>
                    <option>Lace</option>
                    <option>Striped</option>
                    <option>Polka Dot</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Occasion / Use</FormLabel>
                  <Select
                    {...register("occasion")}
                    placeholder="Select occasion"
                  >
                    <option>Everyday</option>
                    <option>Sports</option>
                    <option>Bridal</option>
                    <option>Party</option>
                    <option>Sleepwear</option>
                  </Select>
                </FormControl>

                <FormControl gridColumn={{ base: "1 / -1", md: "1 / -1" }}>
                  <FormLabel>Care Instructions</FormLabel>
                  <Textarea
                    {...register("careInstructions")}
                    placeholder="Machine wash cold, Do not bleach, Line dry in shade."
                    rows={2}
                  />
                </FormControl>
              </SimpleGrid>

              <Divider my={6} />

              {/* SECTION: DESCRIPTION & TAGS */}
              <Heading size="md" mb={3}>
                Description & Tags
              </Heading>

              <FormControl mb={4}>
                <FormLabel>Short Description</FormLabel>
                <Textarea
                  {...register("shortDescription")}
                  placeholder="2–3 line summary for listing cards."
                  rows={2}
                />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Full Description</FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="Detailed product description, features, feel, fit..."
                  rows={5}
                />
              </FormControl>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <Input
                    {...register("tags")}
                    placeholder="bestseller, seamless, wireless, summer"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Collections</FormLabel>
                  <Input
                    {...register("collections")}
                    placeholder="Summer Collection, Bridal Edit"
                  />
                </FormControl>
              </SimpleGrid>

              <Divider my={6} />

              {/* SECTION: SEO */}
              <Heading size="md" mb={3}>
                SEO Settings
              </Heading>

              <SimpleGrid columns={[1, 2]} gap={4}>
                <FormControl>
                  <FormLabel>Meta Title</FormLabel>
                  <Input
                    {...register("metaTitle")}
                    placeholder="Best padded bra for everyday comfort | HOI"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Meta Description</FormLabel>
                  <Textarea
                    {...register("metaDescription")}
                    rows={2}
                    placeholder="Shop ultra-comfortable padded bras with full coverage, perfect for daily wear..."
                  />
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={[1, 2]} gap={4} mt={4}>
                <FormControl>
                  <FormLabel>SEO Keywords</FormLabel>
                  <Input
                    {...register("seoKeywords")}
                    placeholder="padded bra, seamless bra, cotton bra"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Comma separated – ye focus keywords rahenge.
                  </Text>
                </FormControl>

                <FormControl>
                  <FormLabel>Schema Markup (JSON-LD)</FormLabel>
                  <Textarea
                    {...register("seoSchema")}
                    rows={4}
                    placeholder='{"@context": "https://schema.org", "@type": "Product", ...}'
                  />
                </FormControl>
              </SimpleGrid>

              <Flex justify="flex-end" mt={8}>
                <Button colorScheme="blue" type="submit">
                  Save Product
                </Button>
              </Flex>
            </form>
          </Box>

          {/* RIGHT: LIVE PREVIEW CARD */}
          <Box
            flex="1.4"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            p={4}
            boxShadow="sm"
            position="sticky"
            top="80px"
            h="fit-content"
          >
            <Text fontSize="sm" fontWeight="600" color="gray.500" mb={3}>
              Live Preview
            </Text>

            <Box
              borderWidth="1px"
              borderColor={borderColor}
              borderRadius="lg"
              overflow="hidden"
            >
              {/* Image Preview */}
              <Box
                h="220px"
                bgGradient="linear(to-br, purple.100, pink.100)"
                position="relative"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt={nameWatch}
                    objectFit="cover"
                    w="100%"
                    h="100%"
                  />
                ) : (
                  <Flex
                    w="100%"
                    h="100%"
                    align="center"
                    justify="center"
                    direction="column"
                    gap={1}
                    color="gray.500"
                  >
                    <Text fontSize="xs">Main image preview</Text>
                    <Text fontSize="xs">Upload image to see here</Text>
                  </Flex>
                )}

                {isFeaturedWatch && (
                  <Badge
                    position="absolute"
                    top={3}
                    left={3}
                    colorScheme="pink"
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="0.6rem"
                  >
                    Featured
                  </Badge>
                )}
              </Box>

              <Box p={4}>
                <Text fontSize="xs" textTransform="uppercase" color="gray.500">
                  {brandWatch} • {categoryWatch}
                </Text>
                <Heading size="sm" mt={1} mb={2}>
                  {nameWatch}
                </Heading>

                <Flex align="center" gap={2} mb={2}>
                  <Text fontWeight="bold" fontSize="lg">
                    ₹{salePrice || mrp || 0}
                  </Text>
                  {discount > 0 && (
                    <>
                      <Text
                        fontSize="sm"
                        color="gray.500"
                        textDecor="line-through"
                      >
                        ₹{mrp || 0}
                      </Text>
                      <Badge colorScheme="green" fontSize="xs">
                        {discount}% OFF
                      </Badge>
                    </>
                  )}
                </Flex>

                {colorsWatch && (
                  <Text fontSize="xs" color="gray.500" mb={1}>
                    Colors: {colorsWatch}
                  </Text>
                )}

                {tagsWatch && (
                  <Text fontSize="xs" color="gray.400">
                    Tags: {tagsWatch}
                  </Text>
                )}
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default AddProducts;
